/**
 * Created by luwen on 2017/5/11.
 */
function initWebGL(canvas) {//初始化context
    var gl = null;
    try {
        gl = canvas.getContext('webgl');
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
function  initMartics(canvas){//初始化矩阵
   modelViewMatrix=mat4.create();
    mat4.translate(modelViewMatrix,modelViewMatrix,[0,0,-3.33]);
    projectionMatrix=mat4.create();
    mat4.perspective(projectionMatrix,Math.PI/4,canvas.width/canvas.height,1,1000);
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
    "void main(void){\n" +
    "gl_Position=projectionMatrix*modelViewMatrix*vec4(vertexPos,1.0);\n" +
    "}\n";
var fragmentShaderSource="void main(void){\n" +
    "gl_FragColor=vec4(1.0,1.0,1.0,1.0);\n" +
    "}\n";
var shaderProgram;
var shaderVertexPositonAttribute;
var shaderProjectionMatrixUniform;
var shaderModelViewMatrixUniform;
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
    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
       return;
    }
}
function draw(gl,obj){
    gl.clearColor(0.0,1.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER,obj.buffer);
    gl.vertexAttribPointer(shaderVertexPositonAttribute,obj.vertSize,gl.FLOAT,false,0,0);
    gl.uniformMatrix4fv( shaderProjectionMatrixUniform,false,projectionMatrix);
    gl.uniformMatrix4fv( shaderModelViewMatrixUniform,false,modelViewMatrix);
    gl.drawArrays(obj.primtype,0,obj.nVerts);

}
$(document).ready(
    function(){
        var canvas=document.getElementById('webgl');
        var gl=initWebGL(canvas);
        initViewPort(gl,canvas);
        initMartics(canvas);
        var square=createSquare(gl);
        initShader(gl);
        draw(gl,square);
    }
)

