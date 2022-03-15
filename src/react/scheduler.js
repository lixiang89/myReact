import { TAG_HOST, TAG_ROOT, TAG_TEXT, PLACEMENT } from "./constants.js";
import { reconcileChildren } from "./reconcileChildren.js";
import { setProps } from "./utils.js";

let workInProgressRoot = null//正在渲染中的fiber
let nextUnitOfWork = null//下一个执行单元

export function scheduleRoot(rootFiber) {
    workInProgressRoot = rootFiber
    nextUnitOfWork = workInProgressRoot
}

// 每一帧结束都会执行
function workLoop(deadline) {
    let shouldYield = false//是否暂停
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = preformUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        console.log('调和结束')
        commitRoot()
    }

    // 不管有没有任务，都请求再次调度，每一帧都要执行一次workLoop，检查任务
    requestIdleCallback(workLoop, { timeout: 500 })
}

function preformUnitOfWork(currentFiber) {
    // 先遍历自己
    beginWork(currentFiber)
    // 遍历大儿子
    if (currentFiber.child) {
        return currentFiber.child
    }

    while (currentFiber) {
        // 没有子节点的先完成
        // 儿子和兄弟完成，让自己完成
        completeUnitOfWork(currentFiber)
        // 有兄弟节点的话，先处理
        if (currentFiber.sibling) {
            return currentFiber.sibling
        }
        // 子节点都完成了，让父节点完成，父节点是root，return的是null，跳出循环
        currentFiber = currentFiber.return
    }
}

function beginWork(currentFiber) {
    switch (currentFiber.tag) {
        case TAG_ROOT:
            updateHostRoot(currentFiber)
            break
        case TAG_TEXT:
            updateHostText(currentFiber)
            break
        case TAG_HOST:
            updateHost(currentFiber)
            break
        default:
            break;
    }
}

// 根fiber 
function updateHostRoot(currentFiber){
    const children=currentFiber.props.children
    reconcileChildren(currentFiber,children)
}

// stateNode是外部传入
function updateHostText(currentFiber){
    // 文本类型，不存在子节点，无需reconcileChildren
    if(!currentFiber.stateNode){
        currentFiber.stateNode=createDom(currentFiber)
    }
}

// 原生类型
function updateHost(currentFiber){
    if(!currentFiber.stateNode){
        currentFiber.stateNode=createDom(currentFiber)
    }
    const children=currentFiber.props.children
    reconcileChildren(currentFiber,children)
}

function createDom(currentFiber){
    if(currentFiber.tag===TAG_TEXT){
        return document.createTextNode(currentFiber.props.text)
    }else if(currentFiber.tag===TAG_HOST){
        // span div等原生标签
        const stateNode=document.createElement(currentFiber.type)
        updateDom(stateNode,{},currentFiber.props)
        return stateNode
    }
}

function updateDom(stateNode,oldProps,newProps){
    if(stateNode&&stateNode.setAttribute){//真实dom
        setProps(stateNode,oldProps,newProps)
    }
}

function completeUnitOfWork(currentFiber){
    let returnFiber=currentFiber.return;
    if(!returnFiber) return;

    if(!returnFiber.firstEffect){
        returnFiber.firstEffect=currentFiber.firstEffect
    }

    if(currentFiber.lastEffect){
        if(returnFiber.lastEffect){
            // 让上一个单元的lsateffect。nextEffect指向
            returnFiber.lastEffect.nextEffect=currentFiber.firstEffect
        }
        returnFiber.lastEffect=currentFiber.lastEffect
    }

    // 有effectTag说明有副作用，收集
    if(currentFiber.effectTag){
        if(returnFiber.lastEffect){
            returnFiber.lastEffect.nextEffect=currentFiber
        }else{
            returnFiber.firstEffect=currentFiber
        }
        returnFiber.lastEffect=currentFiber
    }
}

// commit阶段

function commitRoot(){
    let currentFiber=workInProgressRoot.firstEffect

    while(currentFiber){
        commitWork(currentFiber)
        currentFiber=currentFiber.nextEffect
    }

    workInProgressRoot=null;
}

function commitWork(currentFiber){
    if(!currentFiber) return;
    let returnFiber=currentFiber.return;
    const dom=returnFiber.stateNode

    if(currentFiber.effectTag===PLACEMENT&&currentFiber.stateNode){
        dom.appendChild(currentFiber.stateNode)
    }

    currentFiber.effectTag=null
}

requestIdleCallback(workLoop,{timeout:500})