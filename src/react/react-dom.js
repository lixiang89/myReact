import { TAG_ROOT } from "./constants.js";
import { scheduleRoot } from "./scheduler.js";

/**
 * 把一个元素渲染到容器内部
 * @param {*} element 渲染的元素 虚拟dom
 * @param {*} container 挂载的节点
 */

export function render(element, container) {
    const rootFiber={
        tag: TAG_ROOT,// 根fiber
        stateNode:container,//真实dom
        props:{children:[element]}// props.children是一个数组，后面会根据每个React元素创建对应的fiber
    }
    console.log(rootFiber,'rootFiber')
    // 调度开始
    scheduleRoot(rootFiber)
}
