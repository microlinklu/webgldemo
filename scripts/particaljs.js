/**
 * Created by luwen on 2017/5/22.
 */
function init(){
    var scene=new THREE.Scene();
    var camera=new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
    var renderer=new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.position.x=0;
    camera.position.y=0;
    camera.position.z=150;
    document.body.appendChild(renderer.domElement);
  //  createSprite();
    var cloud;

   //建立粒子精灵(10行10列固定状态的原始默认粒子)
    function createSprite(){
  //    var mat=new THREE.SpriteMaterial();//默认粒子材质
        var geom=new THREE.Geometry();
        var mat1=new THREE.PointCloudMaterial({size:4,vertexColors:true,color:0xff00ff});

        for(var i=-5;i<5;i++)
        for(var j=-5;j<5;j++){
           // var sprite=new THREE.Sprite(mat);
          //  sprite.position.set(i*10,j*10,0);
          //  scene.add(sprite);
            var partical=new THREE.Vector3( i*10,j*10,0);
            geom.vertices.push(partical);
            geom.colors.push(new THREE.Color(Math.random()*0x00ffff));
        }
        var sprite=new THREE.PointCloud(geom,mat1);
        scene.add(sprite);
    }
    var controls=new function(){
        this.size=4;
        this.transparent=true;
        this.opacity=0.4;
        this.vertexColors=true;
        this.color=0xffffff;
        this.sizeAttenuation=true;
        this.rotateSystem=true;
        this.redraw=function(){
            createPrticals(controls.size,controls.transparent,controls.opacity,controls.vertexColors,controls.sizeAttenuation,controls.color);
        }
    }
    function createPrticals(size,transparent,opacity,vertexColors,sizeAttenuation,color){
        var geom=new THREE.Geometry();
        var material=new THREE.PointCloudMaterial({
            size:size,
            transparent:transparent,
            opacity:opacity,
            vertexColors:vertexColors,
            sizeAttenuation:sizeAttenuation,
            color:color
        });
        var rang=400;
        for(var i=0;i<1000;i++){
            var partical=new THREE.Vector3(Math.random()*rang-rang/2,Math.random()*rang-rang/2,Math.random()*rang-rang/2);
            geom.vertices.push(partical);
            var color=new THREE.Color(0xffff00);
            geom.colors.push(color);
        }
        cloud=new THREE.PointCloud(geom,material);
        scene.add(cloud);
    }
    var angle=0;
    function run(){
        requestAnimationFrame(run);
        angle+=0.01;
        cloud.rotation.x=angle;
        cloud.rotation.z=angle;
        renderer.render(scene,camera);
    }
    controls.redraw();
    run();
}
window.onload=init;