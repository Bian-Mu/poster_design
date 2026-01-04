export type ShapeType = 'circle' | 'triangle' | 'rect' | 'star';

export interface BaseElement {
    id:string;
    type:'shape' | 'text' | 'image';
    x:number;
    y:number;
    width:number;
    height:number;
    zIndex:number;
    rotation?:number;
    opacity?:number;
}

export interface ShapeElement extends BaseElement {
    type:'shape';
    shapeType:ShapeType;
    fillColor?:string; // 内部填充颜色
    strokeColor?:string; // 描边颜色
    strokeWidth?:number; // 描边宽度
}

export interface TextElement extends BaseElement {
    type:'text';
    textContent:string;
    fontSize?:number;
    fontFamily?:string;
    fontWeight?:'normal' | 'bold' | 'bolder' | 'lighter' | number;
    color?:string;
    textAlign?:'left' | 'center' | 'right';
}

export interface ImageElement extends BaseElement {
    type:'image';
    src:string; // 图片来源URL
}

export type CanvasElement = ShapeElement | TextElement | ImageElement;