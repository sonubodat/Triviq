"""Analysis-by-synthesis fit of the orbit-ring parameters against the reference mask (deterministic, no browser)."""
import sys, math, random, pathlib, json
import numpy as np
SK='/Users/sonubodat/.mcphub/skills/img2threejs'
sys.path.insert(0,SK+'/forge'); sys.path.insert(0,SK+'/forge/stage1_intake'); sys.path.insert(0,SK+'/forge/stage4_review')
import importlib
dr=importlib.import_module('diagnose_render')
P='/Users/sonubodat/Desktop/Triviq/triviq-website/design/triviq-core'
ref_mask,_=dr.load_mask(pathlib.Path(P+'/reference-mark.png'))
REF=np.array(ref_mask,dtype=bool).reshape(224,224)

W,H=700,544; F=(H/2)/math.tan(math.radians(12.5)); CAMZ=6.1; CAMY=0.12; ZSHIFT=-0.23
def project(pts):
    X,Y,Z=pts[:,0],pts[:,1],pts[:,2]+ZSHIFT
    zc=CAMZ-Z; px=W/2+X/zc*F; py=H/2-(Y-CAMY)/zc*F
    return px*224/W, py*224/H

def paint(mask,gx,gy):
    ix=np.clip(gx.astype(int),0,223); iy=np.clip(gy.astype(int),0,223)
    mask[iy,ix]=True

def rect_mask(mask,x0,x1,y0,y1,z0,z1):
    # T / chips as dense point clouds on a box
    xs=np.linspace(x0,x1,60); ys=np.linspace(y0,y1,60)
    X,Y=np.meshgrid(xs,ys); Z=np.full_like(X,z1)
    pts=np.stack([X.ravel(),Y.ravel(),Z.ravel()],1); gx,gy=project(pts); paint(mask,gx,gy)

def rot(p,alpha,beta):
    x,y,z=p
    y2=y*math.cos(alpha)-z*math.sin(alpha); z2=y*math.sin(alpha)+z*math.cos(alpha)
    x3=x*math.cos(beta)-y2*math.sin(beta); y3=x*math.sin(beta)+y2*math.cos(beta)
    return np.array([x3,y3,z2])

def stations(R,alpha,beta,th0,th1,n,rxm,rzm,plateau,lbias,cx=0,cy=0,rxb=0.0,platx=None):
    st=[]
    for i in range(n):
        u=i/(n-1); th=math.radians(th0+(th1-th0)*u)
        w=(math.sin(math.pi*u)**plateau)*(1-lbias*u) if 0<i<n-1 else 0.0
        wx=(math.sin(math.pi*u)**(platx if platx else plateau))*(1+rxb*u) if 0<i<n-1 else 0.0
        c=rot((R*math.cos(th),0,R*math.sin(th)),alpha,beta)+np.array([cx,cy,0.0])
        st.append((c,rxm*wx,rzm*w))
    return st

def sweep_points(st,sub=14,ang=20):
    cs=np.array([s[0] for s in st]); n=len(cs)
    tang=[]
    for i in range(n):
        a=cs[max(0,i-1)]; b=cs[min(n-1,i+1)]; t=b-a; tang.append(t/np.linalg.norm(t))
    ref=np.array([0,0,1.0])
    if abs(np.dot(tang[0],ref))>0.9: ref=np.array([1.0,0,0])
    carried=ref-tang[0]*np.dot(ref,tang[0]); carried/=np.linalg.norm(carried)
    N=[];B=[]
    for t in tang:
        nn=carried-t*np.dot(carried,t)
        if np.linalg.norm(nn)<1e-9: nn=np.array([1.0,0,0])
        nn/=np.linalg.norm(nn); N.append(nn); B.append(np.cross(t,nn)/np.linalg.norm(np.cross(t,nn))); carried=nn
    rings=[]
    for i,(c,rx,rz) in enumerate(st):
        th=np.linspace(0,2*math.pi,ang,endpoint=False)
        rings.append(c+np.outer(np.cos(th),N[i])*rx+np.outer(np.sin(th),B[i])*rz)
    pts=[]
    for i in range(n-1):
        for s in np.linspace(0,1,sub,endpoint=False):
            pts.append(rings[i]*(1-s)+rings[i+1]*s)
    pts.append(rings[-1])
    return np.concatenate(pts,0)

def dilate(m):
    d=m.copy()
    d[1:,:]|=m[:-1,:]; d[:-1,:]|=m[1:,:]; d[:,1:]|=m[:,:-1]; d[:,:-1]|=m[:,1:]
    return d

def build_mask(p):
    m=np.zeros((224,224),bool)
    rect_mask(m,-0.325,0.285,-1.0,0.52,0,0.46)         # stem (z front = 0.46)
    rect_mask(m,-0.89,0.55,0.84,1.0,0,0.5); rect_mask(m,-0.89,0.89,0.48,0.84,0,0.5)  # crossbar (notch)
    rect_mask(m,0.775-0.135,0.775+0.135,1.086-0.135,1.086+0.135,0,0.27)
    rect_mask(m,1.12-0.12,1.12+0.12,1.235-0.12,1.235+0.12,0,0.24)
    rect_mask(m,1.06-0.075,1.06+0.075,0.884-0.075,0.884+0.075,0,0.15)
    near=stations(p['R'],math.radians(p['alpha']),math.radians(p['beta']),p['n0'],p['n1'],27,p['rx'],p['rz'],p['plat'],p['lb'],p['cx'],p['cy'],p.get('rxb',0.0),p.get('platx'))
    far=stations(p['R'],math.radians(p['alpha']),math.radians(p['beta']),p['f0'],p['f1'],11,p['frx'],p['frz'],0.6,0.0,p['cx'],p['cy']+p['fdy'])
    for st in (near,far):
        pts=sweep_points(st); pts[:,2]+=0.23
        gx,gy=project(pts); paint(m,gx,gy)
    m=dilate(m)
    flat,_=dr.largest_component(m.ravel().tolist(),224)
    return np.array(flat,dtype=bool).reshape(224,224), m

def iou(p):
    m,_=build_mask(p); i=(m&REF).sum(); u=(m|REF).sum(); return i/u

if __name__=='__main__':
    p=dict(R=1.25,alpha=24,beta=11,n0=205,n1=5,rx=0.075,rz=0.21,plat=0.6,lb=0.7,cx=0.0,cy=0.0,f0=-35,f1=-112,frx=0.05,frz=0.10,fdy=0.0)
    print('start IoU',round(iou(p),3))
    rng=random.Random(7)
    best=iou(p); bp=dict(p)
    ranges=dict(R=(1.1,1.45),alpha=(10,40),beta=(0,28),n0=(185,235),n1=(-20,25),rx=(0.03,0.2),rz=(0.1,0.45),plat=(0.15,0.9),lb=(0.0,0.9),cx=(-0.2,0.2),cy=(-0.3,0.3),f0=(-60,-10),f1=(-140,-80),frx=(0.02,0.15),frz=(0.04,0.3),fdy=(-0.3,0.1))
    for it in range(1500):
        q=dict(bp); k=rng.choice(list(ranges)); lo,hi=ranges[k]
        sigma=(hi-lo)*(0.25 if it<500 else 0.08)
        q[k]=min(hi,max(lo,q[k]+rng.gauss(0,sigma)))
        v=iou(q)
        if v>best: best=v; bp=q
        if it%250==0: print(it,round(best,4))
    print('best IoU',round(best,4)); print(json.dumps({k:round(v,4) for k,v in bp.items()}))
    json.dump(bp,open('/private/tmp/claude-501/-Users-sonubodat-Desktop-Triviq/eb89bd34-2aa5-4308-b544-6be72a046113/scratchpad/core/ring_fit.json','w'))
