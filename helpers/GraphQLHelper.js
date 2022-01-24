const getSelectionFieldByNode = (node, withoutNestedElements) => {
    const requestedAttributes = [];
    if (node) {
        node.selectionSet.selections.forEach((item) => {
            if (item.name.value !== '__typename' && item.name.value !== 'recordsLength' && (item.selectionSet === undefined && withoutNestedElements)) {
                requestedAttributes.push(item.name.value);
            }
        });
    }
    return requestedAttributes;
};

const getNodeFromKey = (mainNode, key) => {
    let node;
    mainNode.selectionSet.selections.forEach((item) => {
        if (item.name.value === key) {
            node = item;
        }
    });
    return node;
};
/**
 * Defines methods used recurrently in different parts of the GraphQL Schema
 *  It allows to get nested fields, by sending keys element, if nested elements is required, keys input must be sent separated by . (dot)
 *  example1 = 'accounts' => Nested element in level 0.
 *  example2 = 'accounts.lastAccountNote.otherElment' => nested element in level 2
 */
export const getSelectionFieldNodes = (info, keys, flagNestedElements = true) => {
    let requestedAttributes = [];
    if (!keys) {
        requestedAttributes = getSelectionFieldByNode(info.fieldNodes[0], flagNestedElements);
    } else {
        const keyToArray = keys.split('.');
        const nestedLevels = keyToArray.length;
        let nextNode = info.fieldNodes[0];
        keyToArray.forEach((key, i) => {
            if (i === nestedLevels - 1) {
                nextNode = getNodeFromKey(nextNode, key);
                requestedAttributes = getSelectionFieldByNode(nextNode, flagNestedElements);
            } else {
                nextNode = getNodeFromKey(nextNode, key);
            }
        });
    }

    // Returns only the set of attributes that the client requested
    // through the graphql client (Apollo client)
    return requestedAttributes;
};

export const getSelectionSetNodes = (info) => {
    const selectionSet = {};
    const keys = Object.keys(info.variableValues || {});
    if (keys.length > 0) {
        keys.forEach((key) => {
            selectionSet[key] = info.variableValues[key];
        });
    } else {
        info.operation.selectionSet.selections[0].arguments.forEach((item) => {
            if (item.name.value !== '__typename' && item.value !== undefined) {
                selectionSet[item.name.value] = item.value.value;
            }
        });
    }

    return selectionSet;
};

export const getFieldsAtFirstLevel = (node) => {
    const requestedAttributes = [];

    if (node) {
        node.selectionSet.selections.forEach((item) => {
            if (item.name.value !== '__typename' && item.name.value !== 'recordsLength') {
                requestedAttributes.push(item.name.value);
            }
        });
    }

    return requestedAttributes;
};

export const hasAttributes = (info, property) => {
    const attr = getSelectionFieldNodes(info, property);

    return attr.length > 0;
};
