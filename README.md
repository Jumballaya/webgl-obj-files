# 3D Rendering with WebGL

[Running example](https://jumballaya.github.io/webgl-obj-files/)

## Source Code Folders

- core: Core classes to build the 3D scene
    - materials: Pre-made materials
- formats: 3D model formats. Currently only 1 format exists: OBJ
- gl: Core WebGL processes like buffer management
- math: Vector and Matrix math
- shaders: Pairs of vertex/fragment shaders

## Core files

### Geometry 
This is where the webgl array buffers are built and filled in with the geometry's vertex data.

### Material
This is where the webgl shaders are compiled into a single webgl program. The material is also responsible for managing and updating the shader's uniforms.

### Object3D
Basic renderable object that has a Geometry and a Material. You can manipulate the object's transforms like rotation, translation and scale.

### World
Wrapper class that handles the canvas, webgl2 context, rendering, object creation and more.

### Camera
Wrapper class around transforms and generates the projection and view matrices.

