.PHONY: default tests build open

default: build

build:
	rm -f build/CanvasShapes.js
	# if you change the order here, please update tests/jasmine/SpecRunner.js accordingly
	cat build/_inserts/_before.js src/Main.js src/Underscore.js src/UUID.js src/Tools.js src/GeometryTools.js src/Config.js src/ClassInterface.js src/ClassAbstract.js src/Class.js src/Error.js src/CacheInterface.js src/CacheAbstract.js src/EventInterface.js src/EventAbstract.js src/Event.js src/Event.Mouse.js src/Event.Input.js src/InteractionInterface.js src/InteractionAbstract.js src/SceneLayerInterface.js src/SceneLayerAbstract.js src/SceneLayer.js src/SceneInterface.js src/SceneAbstract.js src/Scene.js src/Renderer.js src/RenderingInterface.js src/RenderingAbstract.js src/StyleInterface.js src/StyleAbstract.js src/Style.js src/CoordinatesInterface.js src/CoordinatesAbstract.js src/AnimationFrameInterface.js src/AnimationFrameAbstract.js src/AnimationFrame.js src/AnimationInterface.js src/AnimationAbstract.js src/ShapeInterface.js src/ShapeAbstract.js src/Shape.js src/GroupInterface.js src/GroupAbstract.js src/Group.js src/shapes/complex/GroupShape.js src/shapes/primitives/Polygon.js src/shapes/primitives/Quadrilateral.js src/shapes/primitives/Triangle.js src/shapes/primitives/Rectangle.js src/shapes/primitives/Square.js src/shapes/primitives/Point.js src/shapes/primitives/Line.js src/shapes/primitives/Arc.js src/shapes/primitives/Circle.js src/shapes/primitives/BezierCurve.js src/shapes/math/Relation.js build/_inserts/_after.js > build/CanvasShapes.js
	rm -f tests/jasmine/src/CanvasShapes.js
	cp build/CanvasShapes.js tests/jasmine/src/

open: build
	# opening first as server will be up first anyway
	open http://localhost:8000/examples/
	python -m SimpleHTTPServer 8000

tests: build
	open tests/jasmine/SpecRunner.html
