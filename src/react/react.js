import { ELEMENT_TEXT } from './constants.js';

/**
 * 创建虚拟dom的方法
 * @param {*} type 元素类型 div span
 * @param {*} config 配置对象 元素属性
 * @param {...any} children array
 */

export function createElement(type, config, ...children) {
    delete config.__self
    delete config.__source

    const newChildren = children.flatMap(child => {
        //child 是一个createElement返回的元素
        if (typeof child === 'object') return child
        // 字符串
        return {
            type: ELEMENT_TEXT,
            props: { text: child, children: [] }
        }
    })

    return {
        type,
        props: {
            ...config,
            children: newChildren
        }
    }
}
