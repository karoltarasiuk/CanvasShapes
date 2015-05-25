.PHONY: default tests build open

default: build

build:
	rm -f build/CanvasShapes.js
	cat build/_inserts/_before.js src/Main.js src/Tools.js src/Config.js src/ClassInterface.js src/ClassAbstract.js src/Class.js src/Error.js src/SceneLayerInterface.js src/SceneLayerAbstract.js src/SceneLayer.js src/SceneInterface.js src/SceneAbstract.js src/Scene.js src/Renderer.js src/InteractionInterface.js src/RenderingInterface.js src/RenderingAbstract.js src/Rendering.js src/StyleInterface.js src/StyleAbstract.js src/Style.js src/CoordinatesInterface.js src/CoordinatesAbstract.js src/ShapeInterface.js src/ShapeAbstract.js src/Shape.js src/GroupInterface.js src/GroupAbstract.js src/Group.js src/shapes/primitives/Polygon.js src/shapes/primitives/Quadrilateral.js src/shapes/primitives/Triangle.js src/shapes/primitives/Rectangle.js src/shapes/primitives/Square.js src/shapes/primitives/Point.js src/shapes/primitives/Line.js src/shapes/primitives/Arc.js src/shapes/primitives/Circle.js build/_inserts/_after.js > build/CanvasShapes.js
	rm -f tests/jasmine/src/CanvasShapes.js
	cp build/CanvasShapes.js tests/jasmine/src/

open: build
	open http://localhost:8000/
	python -m SimpleHTTPServer 8000

tests: build
	open tests/jasmine/SpecRunner.html
