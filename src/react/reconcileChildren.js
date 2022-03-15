import { ELEMENT_TEXT,TAG_TEXT,TAG_HOST,PLACEMENT } from "./constants.js";

/**
 * 创建fiber
 * @param {*} currentFiber 当前的fiber
 * @param {*} newChildren 当前节点的子节点 虚拟都没数组
 */

 export function reconcileChildren(currentFiber,newChildren){
     let newChildIndex=0; // 虚拟dom索引
     let prevSibling
     while(newChildIndex<newChildren.length){
         const newChild=newChildren[newChildIndex]
         let tag;
         if(newChild&&newChild.type===ELEMENT_TEXT){
             tag=TAG_TEXT
         }else if(newChild&&typeof newChild.type==='string'){
             tag=TAG_HOST
         }

         let newFiber={
             tag,
             type:newChild.type,// 元素类型
             props:newChild.props,// 新的属性
             stateNode:null,
             return:currentFiber,// 父fiber
             effectTag:PLACEMENT,// 副作用 标识
             nextEffect:null,
         }

         if(newChildIndex===0){
             currentFiber.child=newFiber// 第一个子节点挂载到父节点的child上
         }else{
             prevSibling.sibling=newFiber//第二次循环开始
         }

         prevSibling=newFiber//记录当前节点

         newChildIndex++
     }
 }