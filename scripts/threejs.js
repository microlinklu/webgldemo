/**
 * Created by luwen on 2017/5/16.
 */
$(function(){
    //建立场景对象
    var scene=new THREE.Scene();
 //   var fog=new THREE.FogExp2(0xffff00,0.15);
 //   scene.add(fog)
   //设置摄像机，视角为75度，视口宽高比，近端裁切面，远端裁切面
  //设置透视投影摄像机
     var camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    //设置正交摄像机
    var camera2=new THREE.OrthographicCamera(-window.innerWidth/2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,0.1,1000);
    //建立webgl渲染器
    var renderer=new THREE.WebGLRenderer();
    //设置窗口大小
    renderer.setSize(window.innerWidth,window.innerHeight);
    var stero=new THREE.StereoCamera();
    //将渲染器添加到body中
    document.body.appendChild(renderer.domElement);
    var geometry=new THREE.BoxGeometry(3,3,3);
    var martial=new THREE.MeshBasicMaterial({color:0xff0000});
    var cube=new THREE.Mesh(geometry,martial);
    var martial2=new THREE.MeshBasicMaterial({color:0x00ff00});
    var cube2=new THREE.Mesh(geometry,martial2);
    //var plane1=new THREE.PlaneGeometry(300,300,1,1)
    //plane1.rotationx=Math.PI/2;
    //plane1.positionz=-10;
    var martial3=new THREE.MeshBasicMaterial({color:0xffffff})
 //   var pl=new THREE.Mesh(plane1,martial3);
   // cube2.position.z=-7;
    cube2.position.x=2;
    camera.position.z=7;
    //添加环境光
    //var ambiLight = new THREE.AmbientLight(0xffffff);
    //scene.add(ambiLight);
    var pointLight=new THREE.PointLight(0xff0000,2.0);
    pointLight.decay=100;
    pointLight.position.set(1,1,8);
    scene.add(pointLight);
    var listen=new THREE.AudioListener();
    var sound=new THREE.Audio(listen);
    var audio=new THREE.AudioLoader().load('sound/song.mp3',function(buffer){
        sound.setBuffer(buffer)
        sound.setVolume(0.5);
      sound.play();
    });
  //  camera.position.y=4;
  //  var target=new THREE.Vector3(0.0,0.0,0.0)
  //  camera.lookAt(target);
    scene.add(cube);
    scene.add(cube2);
   // scene.add(pl);
    scene.add(camera2);

    function run(){
        requestAnimationFrame(run);
      //  cube.rotation.y+=0.1;
     //   renderer.render(scene,camera);
          renderer.render(scene,stero);

    }
    run();
    window.onkeydown=function(e){
        sound.stop();
      //  alert(e.keyCode);
          switch(e.keyCode) {
              case 87:
                  camera.position.y -= 2;
                  target.y += 2;
                  camera.lookAt(target);
                  break;
              case 65:
                  camera.position.x += 2;
                  break;
              case 83:
                  camera.position.y += 2;
                  break;
              case 68:
                  camera.position.x -= 2;
                  break;

          }

    }
    window.onmousemove=function(e){
      //  target.x= e.clientX-window.innerWidth/2;
     //   target.y= e.clientY-window.innerHeight/2;
      //  camera.lookAt(target)

        var v_mouse=new THREE.Vector3((e.clientX/window.innerWidth*2)-1,-(e.clientY/window.innerHeight)*2+1,0.5);
        v_mouse.unproject(camera);
        var rayCaster=new THREE.Raycaster(camera.position,v_mouse.sub(camera.position).normalize());
        var intersects=rayCaster.intersectObjects(scene.children);

        if(intersects.length>0){
            for(var i=0;i<intersects.length;i++)
            intersects[i].object.material.color.set(0xffffff);
        }
    }
    window.onmousedown=function(e){
        addCube();

    }
    function addCube(){
        var geometry=new THREE.BoxGeometry(3,3,3);
        var martial=new THREE.MeshBasicMaterial({color:Math.random()*100000});
        var cube=new THREE.Mesh(geometry,martial);
        cube.position.x=Math.random()*10-5;
        cube.position.y=Math.random()*10-5;
      //  var texture=THREE.ImageUtils.loadTexture('img/crate.gif');
        var geo=new THREE.BoxGeometry(3,3,3);
       // var texture=new THREE.TextureLoader().load('img/crate.gif')
       //var text1=new THREE.TextureLoader().load('img/brick_diffuse.jpg');
       //var normap=new THREE.TextureLoader().load('img/brick_roughness.jpg');
        var text1=new THREE.TextureLoader().load('img/water.jpg');
        var normap=new THREE.TextureLoader().load('img/waternormals.jpg');
       var mat=new THREE.MeshPhongMaterial();
       // var mat=new THREE.MeshNormalMaterial();
        mat.map=text1;
        mat.nromalMap=normap;
        mat.normalScale.set(1.5,1.5)
       // mat.bumpScale=-0.2;
        var mesh=new THREE.Mesh(geo,mat);
        mesh.position.x=Math.random()*10-5;
        mesh.position.y=Math.random()*10-5;
        scene.add(cube);
       scene.add(mesh) ;
    }


});

