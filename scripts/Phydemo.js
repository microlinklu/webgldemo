/**
 * Created by luwen on 2017/5/23.
 */
'use strict';
    Physijs.scripts.worker='libs/physijs_worker.js';
    Physijs.scripts.ammo='ammo.js';
var scene,camera,light,renderer,render_stats,render;

 var init=function() {
     renderer = new THREE.WebGLRenderer({antialias:true});
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.getElementById('aaa').appendChild(renderer.domElement);
     scene = new Physijs.Scene();
     scene.setGravity(new THREE.Vector3(0, -50, 0));
     camera = new THREE.PerspectiveCamera(50,
         window.innerWidth / window.innerHeight, 1, 1000);
     camera.position.set(50, 50, 50);
     camera.lookAt(new THREE.Vector3(0, 0, 0));
     scene.add(camera);
     light = new THREE.PointLight(0xffffff, 1.0);
     light.position.set(50, 50, 50);
     scene.add(light);
     createGround();

     render_stats=new Stats();
     var points= getPoints();
     var stones=[];
     requestAnimationFrame(render);
     createStones();

     function createStones(){
         points.forEach(function(point){
             var stoneGeo=new THREE.BoxGeometry(0.6,6,2);
             var stone=new Physijs.BoxMesh(stoneGeo, new Physijs.createMaterial(new THREE.MeshPhongMaterial({
                 map:new THREE.TextureLoader().load('img/crate.gif')

             })),1);
             stone.position.copy(point);
             stone.lookAt(scene.position);
             stone.__dirtyRotation=true;
             stone.position.y=2.5;
             scene.add(stone);
             stones.push(stone);
         });
         stones[0].rotation.x=0.2;
         stones[0].__dirtyRotation=true;
     }
    // scene.simulate();

 }
var timeStep;
      render=function() {
         requestAnimationFrame(render);
         renderer.render(scene, camera);
       //  render_stats.update();
        scene.simulate(undefined,1)
     }



     //获取方块的摆放位置
     function getPoints(){
         var points=[];
         var r= 27,cx= 0,cy=0;
         var offset=0;
         for(var i=0;i<1000;i+=6+offset){
             offset=4.5*(i/360);
             var x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cx;
             var z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cy;
             var y=0;
             points.push(new THREE.Vector3(x,y,z));
         }
         return points;
     }
     function createGround(){
         var groundMaterial=Physijs.createMaterial(new THREE.MeshPhongMaterial({
             map:new  THREE.TextureLoader().load("img/water.jpg")
         }),0.6,0.4 );
         var ground=new Physijs.BoxMesh(new THREE.BoxGeometry(60,1,60),groundMaterial,0);
         var left=new Physijs.BoxMesh(new THREE.BoxGeometry(2,3,60),groundMaterial,0);
         left.position.x=-30;
         left.position.y=2;
         var right=new Physijs.BoxMesh(new THREE.BoxGeometry(2,3,60),groundMaterial,0);
         right.position.x=30;
         right.position.y=2;
         var bottom=new Physijs.BoxMesh(new THREE.BoxGeometry(64,3,2),groundMaterial,0);
         bottom.position.z=-30;
         bottom.position.y=2;
         var top=new Physijs.BoxMesh(new THREE.BoxGeometry(64,3,2),groundMaterial,0);
         top.position.z=30;
         top.position.y=2;
         ground.add(left);
         ground.add(right);
         ground.add(bottom);
         ground.add(top);
         scene.add(ground);


}
window.onload=init;