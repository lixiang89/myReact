// 给元素设置属性

export function setProps(dom, oldProps, newProps) {
    for (const key in oldProps) {
        if (key !== 'children') {
            if (newProps.hasOwnProperty(key)) {
                setProp(dom, key, newProps[key]) // 新老都有属性，更新
            } else {
                dom.removeAttribute(key)//老props里有此属性，新props没有，删除
            }
        }

        
    }
    for (const key in newProps) {
        if (key != 'children') {
            if (!oldProps.hasOwnProperty(key)) {
                setProp(dom, key, newProps[key])// 老的没有，新的有，新增
            }
        }
    }
}

function setProp(dom, key, value) {
    if (key.startsWith('on')) {
        dom[key.toLowerCase()] = value//没用合成事件
    } else if (key === 'style') {
        if (value) {
            for (const name in value) {
                dom.style[name] = value[name]
            }
        }
    } else {
        dom.setAttribute(key, value)
    }
}