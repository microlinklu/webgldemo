/**
 * Created by luwen on 2017/5/11.
 */
function initWebGL(canvas) {//初始化context
    var gl = null;
    try {
        gl = canvas.getContext('webgl')||canvas.getContext('experimental-webgl');//experimental-webgl
    } catch (e) {
        alert(e.toString());
    }
    return gl;
}
function initViewPort(gl,canvas){//初始化视口
 gl.viewport(0,0,canvas.width,canvas.height);
}
//投影矩阵，模型矩阵
var projectionMatrix,modelViewMatrix;
var rotateAxis;
function  initMartics(canvas){//初始化矩阵
   modelViewMatrix=mat4.create();
    mat4.translate(modelViewMatrix,modelViewMatrix,[0,0,-8]);

    projectionMatrix=mat4.create();
    mat4.perspective(projectionMatrix,Math.PI/4,canvas.width/canvas.height,1,1000);
    rotateAxis=vec3.create();
    vec3.normalize(rotateAxis,[1,0,0]);
}

function createSquare(gl){
    var vertexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    var verts=[
       0.5,0.5,0.0,
        -0.5,0.5,0.0,
        0.5,-0.5,0.0,
        -0.5,-0.5,0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    var square={buffer:vertexBuffer,vertSize:3,nVerts:4,primtype:gl.TRIANGLE_STRIP};
    return square;
}
//建立立方体
function createCube(gl){
    //顶点缓冲
    var vertexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    var verts=[
        //前面
        -1.0,-1.0,1.0,//0
        1.0,-1.0,1.0, //1
        1.0,1.0,1.0,  //2
        -1.0,1.0,1.0, //3
        //背面
       -1.0,-1.0,-1.0,
        -1.0,1.0,-1.0,
        1.0,1.0,-1.0,
        1.0,-1.0,-1.0,
        //顶面
        -1.0,1.0,-1.0,
        -1.0,1.0,1.0,
        1.0,1.0,1.0,
        1.0,1.0,-1.0,
        //底面
        -1.0,-1.0,-1.0,
        1.0,-1.0,-1.0,
        1.0,-1.0,1.0,
        -1.0,-1.0,1.0,
        //右侧
        1.0,-1.0,-1.0,
        1.0,1.0,-1.0,
        1.0,1.0,1.0,
        1.0,-1.0,1.0,
        //左侧
        -1.0,-1.0,-1.0,
        -1.0,-1.0,1.0,
        -1.0,1.0,1.0,
        -1.0,1.0,-1.0

    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
   //定点索引缓冲
    var verIndexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,verIndexBuffer);
    var verIndex=[
        //前面
       0,1,2, 0,2,3,
        //背面
       4,5,6,  4,6,7,
        //顶面
        8,9,10, 8,10,11,
        //底面
        12,13,14,  12,14,15,
        //右侧
        16,17,18,16,18,19,
        //左侧
        20,21,22, 20,22,23
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(verIndex),gl.STATIC_DRAW);
    //颜色缓冲
    var colorBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    var faceColor=[
        [1.0,0.0,0.0,1.0],//前面
        [0.0,1.0,0.0,1.0],//背面
        [0.0,0.0,1.0,1.0],//顶面
        [1.0,1.0,0.0,1.0],//底面
        [1.0,0.0,1.0,1.0],//右面
        [0.0,1.0,1.0,1.0]//左面
    ];
    var verColor=[];
    for(var i=0;i<6;i++){
        var color=faceColor[i];
        for(var j=0;j<4;j++){
            verColor=verColor.concat(color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verColor),gl.STATIC_DRAW);
    var cube={buffer:vertexBuffer,indices:verIndexBuffer,
        colorBuffer:colorBuffer,colorSize:4,nColors:24,
    vertSize:3,nVerts:24,nIndices:36,primtype:gl.TRIANGLES
    }
    return cube;
}
//建立渲染器，画笔，glsl语言字符串，渲染器类型
 function createShader(gl,str,type){
     var shader;
     if(type=='fragment'){
         shader=gl.createShader(gl.FRAGMENT_SHADER);
     }else if(type='vertex'){
         shader=gl.createShader(gl.VERTEX_SHADER);
     }else{
         return null;
     }
     gl.shaderSource(shader,str);
     gl.compileShader(shader);
     if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
         return null;
     }

     return shader;
 }
var vertexShaderSource="attribute vec3 vertexPos;\n" +
    "uniform mat4 modelViewMatrix;\n"+
        "uniform mat4 projectionMatrix;\n" +
    "attribute vec4 vertexColor;\n" +
    "varying vec4 colors;\n" +
    "void main(void){\n" +
    "gl_Position=projectionMatrix*modelViewMatrix*vec4(vertexPos,1.0);\n" +
    "colors=vertexColor;\n" +
    "}\n";
var fragmentShaderSource="precision mediump float;\n" +
    "varying vec4 colors;\n" +
    "void main(void){\n" +
    "gl_FragColor=colors;\n" +
   // "gl_FragColor=vec4(1.0,1.0,1.0,1.0);\n" +
    "}\n";
var shaderProgram;
var shaderVertexPositonAttribute;
var shaderProjectionMatrixUniform;
var shaderModelViewMatrixUniform;
var shaderVertxColorAttribute;
function initShader(gl){
    var fragmentShader=createShader(gl,fragmentShaderSource,'fragment');
    var vertexShader=createShader(gl,vertexShaderSource,'vertex');
    shaderProgram=gl.createProgram();
    gl.attachShader(shaderProgram,vertexShader);
    gl.attachShader(shaderProgram,fragmentShader);
    gl.linkProgram(shaderProgram);
    shaderVertexPositonAttribute=gl.getAttribLocation(shaderProgram,'vertexPos');
    gl.enableVertexAttribArray(shaderVertexPositonAttribute);
    shaderProjectionMatrixUniform=gl.getUniformLocation(shaderProgram,'projectionMatrix');
    shaderModelViewMatrixUniform=gl.getUniformLocation(shaderProgram,'modelViewMatrix');
    shaderVertxColorAttribute=gl.getAttribLocation(shaderProgram,'vertexColor');
    gl.enableVertexAttribArray(shaderVertxColorAttribute);
    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
       return;
    }
}
function animate(){
   var angle=Math.PI/100;
    mat4.rotate(modelViewMatrix,modelViewMatrix,angle,rotateAxis);
}
function rotCube(gl,cube){
    requestAnimationFrame(function(){
        rotCube(gl,cube);
    });
    draw(gl,cube);
    animate();
}
function draw(gl,obj){
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(shaderProgram);
   gl.bindBuffer(gl.ARRAY_BUFFER,obj.buffer);
   gl.vertexAttribPointer(shaderVertexPositonAttribute,obj.vertSize,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,obj.colorBuffer);
    gl.vertexAttribPointer(shaderVertxColorAttribute,obj.colorSize,gl.FLOAT,false,0,0);

    gl.uniformMatrix4fv( shaderProjectionMatrixUniform,false,projectionMatrix);
    gl.uniformMatrix4fv( shaderModelViewMatrixUniform,false,modelViewMatrix);
    //gl.drawArrays(obj.primtype,0,obj.nVerts);
    gl.drawElements(obj.primtype,obj.nIndices,gl.UNSIGNED_SHORT,0);
}
$(document).ready(
    function(){
        var canvas=document.getElementById('webgl');
        var gl=initWebGL(canvas);
        initViewPort(gl,canvas);
        initMartics(canvas);
      //  var square=createSquare(gl);
        var cube=createCube(gl);
        initShader(gl);
      //  draw(gl,cube);
        rotCube(gl,cube);
    }
)

