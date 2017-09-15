# Polymer SVG Template poly-fill

When defining a custom element in Polymer, `<template>` wouldn't work inside <svg> [won't work](https://github.com/Polymer/polymer/issues/1976), load this poly-fill before calling Polymer factory, shall fix it.

This should work with polymer 2.0 as well.
 
## Usage 
 
 ```!html
<link rel="import" href="../bower_components/polymer-svg-template/polymer-svg-template.html"/>
 <dom-module id="my-svg-template">
	 <template>
	 	<svg>
	 		<template is="dom-if" if="[[_condition]]">
	 			...
	 		</template>
	 	</svg>
	 </template>
</dom-module>
<script>
	//  Polyfill all <template>s inside of the containing svg element.
	PolymerSvgTemplate('my-svg-template');
 	Polymer({
 		is: 'my-svg-template'
 		...
 	})
 </script>
 ```
