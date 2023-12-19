"use strict";


let templateObj = {
    general: {
        fontFamily: '',
        color: '#333333',
        backgroundColor: '#FFFFFF',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    block: []
};
const propertyBlueprint = {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'https://img.freepik.com/free-photo/white-painted-wall-texture-background_53876-138197.jpg',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    textAlign: 'left',

};
const buttonPropertiesBluPrint = {
    buttonText: 'Button link',
    buttonLink: '#',
    buttonBackgroundColor: '#E5E5E5',
    buttonBorderColor: '#D5D5D5',
    buttonColor: '#333333',
    buttonRadius: '4',
    buttonXMargin: '0',
    buttonYMargin: '0',
    buttonXGap: '16',
    buttonYGap: '8',

}
/*-------------------------------------------------*/
function EmailBuilder() {
    this.blockComponent = [
        {
            name: 'text',
            title: 'Text'
        },
        {
            name: 'button',
            title: 'Buttons'
        },
        {
            name: 'divider',
            title: 'Divider'
        },
        {
            name: 'component',
            title: 'Components'
        },
    ];
}
/**
 * Initiate opening interface
 * Drag and drop initialization
 */
EmailBuilder.prototype.init = function (existingTemplate = []) {
    let self = this;

    document.getElementById('peb-builder-container').innerHTML = self.contentOptionHtml();
    if(typeof existingTemplate === 'object' && Object.keys(existingTemplate).length > 0){
        templateObj = existingTemplate;
        setTimeout(function (){
            parseHtmlByTemplateObj();
            setTimeout(function (){
                stylingHtmlByTemplateObj(null, true);
            }, 500);
        }, 200);
    }

    dragula([document.getElementById('peb-components'), document.getElementById('peb-template-container')], {
        copy: function (el, source) {
            return source === document.getElementById('peb-components');
        },
        accepts: function (el, target) {
            return target !== document.getElementById('peb-components') && !document.body.classList.contains('blocked')
        },
        moves: function (el, container, handle) {
            return handle.classList.contains('handle');
        },
    }).on('drop', function (el, target) {
        if(target !== null){
            if (el.classList.contains('peb-component-block')) {
                let new_id = randomStr(6);
                self.onDropBlockTypeHtml(el, new_id);
                openOptionView('comp-'+new_id);
            }
            self.sortComponentBlock();
        }
    });
}
EmailBuilder.prototype.contentOptionHtml = function (){
    let self = this;
    /********* Left Side blocks | content property settings **********/
    let containerHtml = `<div id="peb-component-container">`;
    containerHtml += `<div id="peb-components">`;
    containerHtml += self.blockComponent.map((item) => {
        return `<div class="peb-component-block handle" data-blocktype="${item.name}"><span class="handle">${item.title}</span></div>`;
    }).join('');
    containerHtml += `</div>`
    containerHtml += `
            <div id="peb-general-option">
                <div class="peb-input-container-header peb-justify-content-between mb-1">
                    <span>Template Styles:</span>
                </div>
                <div class="peb-input-container">
                    <label class="me-1">Color: </label><input class="me-1 peb-color-input" type="color" data-attr="color" onInput="changeOptionsValue(event)" value="${templateObj.general.color}"/>
                    <label class="me-1">Background Color: </label><input class="peb-color-input" type="color" data-attr="backgroundColor" onInput="changeOptionsValue(event)" value="${templateObj.general.backgroundColor}"/>
                </div>
                <div class="peb-input-container">
                    <label class="me-1">Left: </label><input class="me-1 peb-num-input" type="number" data-attr="paddingLeft" onInput="changeOptionsValue(event)" value="${templateObj.general.paddingLeft}"/>
                    <label class="me-1">Right: </label><input class="me-1 peb-num-input" type="number" data-attr="paddingRight" onInput="changeOptionsValue(event)" value="${templateObj.general.paddingRight}"/>
                </div>
                <div class="peb-input-container">
                    <label class="me-1">Top: </label><input class="me-1 peb-num-input" type="number" data-attr="paddingTop" onInput="changeOptionsValue(event)" value="${templateObj.general.paddingTop}"/>
                    <label class="me-1">Bottom: </label><input class="me-1 peb-num-input" type="number" data-attr="paddingBottom" onInput="changeOptionsValue(event)" value="${templateObj.general.paddingBottom}"/>
                </div>
                <div class="peb-border-dash"></div>
                <div class="peb-input-container">
                    <label class="peb-nowrap">BG Image Link: </label><input class="ms-1 me-1 peb-input peb-w-100" type="text" data-attr="backgroundImage" onInput="changeOptionsValue(event)"  value="${templateObj.general.backgroundImage}"/>
                </div>
                <div class="peb-input-container">
                    <label class="peb-nowrap">Background size: </label>
                    <select class="ms-1 me-1 peb-input" type="text" data-attr="backgroundSize" onChange="changeOptionsValue(event)" value="${templateObj.general.backgroundSize}">
                        <option>cover</option>
                        <option>contain</option>
                    </select>
                </div>
                <div class="peb-input-container">
                    <label class="peb-nowrap">Background Repeat: </label>
                    <select class="ms-1 peb-input" type="text" data-attr="backgroundRepeat" onChange="changeOptionsValue(event)" value="${templateObj.general.backgroundRepeat}">
                        <option>repeat</option>
                        <option>no-repeat</option>
                        <option>repeat-x</option>
                        <option>repeat-y</option>
                    </select>
                </div>
            </div>`;
    containerHtml += `</div>`;
    /********* Middle Side Content container **********/
    containerHtml += `<div id="peb-template-parent-container"><div id="peb-template-container"></div></div>`;
    /********* Right Side block Options properties **********/
    containerHtml += `<div class="peb-option-container" id="peb-option-container"></div>`;
    return containerHtml;
}

EmailBuilder.prototype.sortComponentBlock = function (){
    let sorted_templateBlockObj = [];
    document.querySelectorAll('.template-block').forEach(divElement => {
        if (!divElement.classList.contains('gu-mirror')) {
            let index = templateObj.block.findIndex(item => 'block-'+item.id === divElement.id);
            sorted_templateBlockObj.push(templateObj.block[index]);
        }
    });
    templateObj.block = sorted_templateBlockObj;
}
EmailBuilder.prototype.onDropBlockTypeHtml = function (element, new_id) {
    let self = this;
    element.className = 'template-block';
    element.id = 'block-'+new_id;
    element.innerHTML = "";
    element.addEventListener('click', templateBlockClick);
    let blockType = element.getAttribute("data-blocktype");
    let propertyOption = {...propertyBlueprint};
    propertyOption.id = new_id;
    propertyOption.type = blockType;
    let needQuill = false;
    let blockProperty;


    if (blockType === 'text') {
        needQuill = true;
        blockProperty = textComponent(propertyOption)
    } else if (blockType === 'button') {
        propertyOption.components = [];
        let buttonProperties = {...buttonPropertiesBluPrint}
        propertyOption.components.push(buttonProperties);
        blockProperty = buttonComponent(propertyOption)
    } else if (blockType === 'divider') {
        blockProperty = dividerComponent(propertyOption)
    } else if (blockType === 'menu') {
        blockProperty = menuComponent(propertyOption);
    }
    element.innerHTML = blockProperty.html;

    element.innerHTML += makeIndicatorAction(new_id);
    propertyOption = blockProperty.properties
    templateObj.block.push(propertyOption);
    if (needQuill) {
        loadQuills([document.getElementById('comp-'+propertyOption.id)]);
    }
    stylingHtmlByTemplateObj(new_id);
}
/*****************************************************/
/*****************************************************/
function makeIndicatorAction(id_name){
    let componentHtml = `<div class="block-indicator" id="indicator-${id_name}">`
    componentHtml += `<svg width="25" height="25" viewBox="0 0 0.45 0.45" fill="none"><path d="M.36.225.12 0v.45L.36.225Z" fill="#FFFFFF"/></svg>`
    componentHtml += `</div>`
    componentHtml += `<div class="component-action">`;
    componentHtml += `<button type="button" class="me-1 peb-btn peb-btn-xs peb-btn-danger" onClick="deleteBlock('${id_name}')" data-id="${id_name}">
        <svg width="16" height="16" viewBox="0 0 1.08 1.08" fill="currentColor"><path class="clr-i-outline clr-i-outline-path-1" d="M.814 1.02H.266A.088.088 0 0 1 .18.93V.337h.06V.93a.028.028 0 0 0 .026.03h.548A.028.028 0 0 0 .84.93V.337H.9V.93a.088.088 0 0 1-.086.09Z"/><path class="clr-i-outline clr-i-outline-path-2" d="M.923.27H.15a.03.03 0 0 1 0-.06h.773a.03.03 0 0 1 0 .06Z"/><path class="clr-i-outline clr-i-outline-path-3" d="M.63.39h.06v.45H.63z"/><path class="clr-i-outline clr-i-outline-path-4" d="M.39.39h.06v.45H.39z"/><path class="clr-i-outline clr-i-outline-path-5" d="M.69.176H.633V.12H.447v.056H.39V.12A.06.06 0 0 1 .447.06h.186A.06.06 0 0 1 .69.12Z"/><path fill="none" d="M0 0h1.08v1.08H0z"/></svg>
        </button>`
    componentHtml += `<button type="button" class="me-1 peb-btn peb-btn-xs peb-btn-primary handle">
        <svg class="handle" width="16" height="16" viewBox="0 0 0.4 0.4"><path fill="currentColor" d="M.315.1H.3C.3.095.295.085.29.08S.278.07.263.07c-.005 0-.01 0-.015.003L.24.06A.036.036 0 0 0 .213.05a.038.038 0 0 0-.036.025L.165.073a.037.037 0 0 0-.027.01C.125.098.125.117.125.12v.01A.05.05 0 0 0 .09.143C.075.16.075.182.075.213v.018c0 .035.018.053.035.07l.007.01C.15.34.18.35.245.35.318.35.35.31.35.222V.159C.35.143.345.107.315.1zM.263.095c.01 0 .013.01.013.015v.02c0 .007.005.013.01.013.007 0 .013-.003.013-.01 0 0 0-.01.01-.007.014.004.016.026.016.032v.065c0 .084-.032.102-.08.102C.185.325.163.318.138.293l-.01-.01C.11.265.1.255.1.23V.215C.1.19.1.17.107.162.11.158.117.155.125.155v.02l-.008.03c0 .003 0 .003.003.003.003.003.005 0 .005 0L.15.177V.125c0-.003 0-.015.005-.02C.158.103.16.1.165.1c.008 0 .01.005.01.01v.01c0 .005.005.013.013.013S.2.125.2.12V.088C.2.085.2.075.213.075.22.075.226.08.226.088v.03C.225.125.23.133.237.133S.25.125.25.12V.107C.25.1.255.095.263.095z"/></svg>
        </button>`
    componentHtml += `</div>`;
    return componentHtml;
}
/*******************Text Component********************/
function textComponent(propertyOption) {
    propertyOption.text = 'Text to Edit';
    let html = ``;
    html += `<div class="peb-editor-container" id="comp-${propertyOption.id}">`;
    html += propertyOption.text;
    html += `</div>`;
    return {
        html: html,
        properties: propertyOption
    }
}
/*******************End Text Component********************/
/*******************Menu Component********************/
function menuComponent() {
    return `
        <button class="">Menu 1</button>
        <button class="">Menu 2</button>
        <button class="">Menu 3</button>
    `
}
/*******************End Menu Component********************/
/*******************Button Component********************/
function buttonComponent(propertyOption, withContainer = true) {
    console.log(propertyOption);
    let html = ``;
    if(withContainer){
        html += `<div class="peb-editor-container"
            id="comp-${propertyOption.id}" >`
    }
    Object.keys(propertyOption.components).forEach(buttonIndex => {
        html += `<a href="${propertyOption.components[buttonIndex].buttonLink}" target="_blank" style="
                background-color: ${propertyOption.components[buttonIndex].buttonBackgroundColor};
                color: ${propertyOption.components[buttonIndex].buttonColor};
                border-radius: ${propertyOption.components[buttonIndex].buttonRadius}px;
                text-decoration:none;
                display:inline-block;
                border:1px solid ${propertyOption.components[buttonIndex].buttonBorderColor};
                padding: ${propertyOption.components[buttonIndex].buttonYGap}px ${propertyOption.components[buttonIndex].buttonXGap}px;
                margin: ${propertyOption.components[buttonIndex].buttonYMargin}px ${propertyOption.components[buttonIndex].buttonXMargin}px;"
            id="button-${buttonIndex}-${propertyOption.id}">`
        html += propertyOption.components[buttonIndex].buttonText;
        html += `</a>`
    })
    if(withContainer) {
        html += `</div>`
    }
    return {
        html: html,
        properties: propertyOption
    }
}
function addMoreButton(event){
    let block_index = event.target.dataset.blockindex
    let blockProperty = templateObj.block[block_index].components
    let new_button = {...buttonPropertiesBluPrint}
    blockProperty.push(new_button);
    templateObj.block[block_index].components = blockProperty;
    let buttonProperty = buttonComponent(templateObj.block[block_index], false);
    let idName = event.target.dataset.id;
    document.getElementById('comp-'+idName).innerHTML = buttonProperty.html
    openOptionView('comp-'+idName);
    stylingHtmlByTemplateObj(idName);
}

function RemoveThisButton(event){
    let componentIndex = event.target.dataset.componentindex;
    let componentId = event.target.dataset.id;
    let components = templateObj.block[event.target.dataset.blockindex].components;
    components.splice(componentIndex, 1);
    let button = document.getElementById("button-1-"+componentId);
    if (button) {
        button.parentElement.removeChild(button);
    }
    setTimeout(function (){
        openOptionView('comp-'+componentId);
    },200)
}
/*******************End Button Component********************/
/*******************Divider Component********************/
function dividerComponent(propertyOption) {
    let html = ``;
    html += `<div class="peb-editor-container" id="comp-${propertyOption.id}">`
    html += `<hr/>`
    html += `</div>`
    return {
        html: html,
        properties: propertyOption
    }
}
/*******************End Divider Component********************/
/*===================================================================================================================================================*/
/*===================================================================================================================================================*/
function openOptionView(component_id) {
    let propertyHtml = ``;
    let idSplit = component_id.split("-");
    let idName = idSplit[idSplit.length - 1];
    let indicatorId = 'indicator-'+idName;
    /*-----*/
    let index = templateObj.block.findIndex(item => item.id === idName);
    let properties = templateObj.block[index];
    if(properties !== undefined){
        document.querySelectorAll('.block-indicator').forEach(allIndicator => {
            allIndicator.style.display = 'none';
        });
        document.getElementById(indicatorId).style.display = 'block';
        /*-----*/
        propertyHtml += `<div class="peb-input-container">`;
        if(properties['paddingLeft'] !== undefined){
            propertyHtml += `<label class="">Left: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                data-attr="paddingLeft"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['paddingLeft']}"/>`;
        }
        if(properties['paddingRight'] !== undefined){
            propertyHtml += `<label class="">Right: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                data-attr="paddingRight"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['paddingRight']}"/>`
        }
        propertyHtml += `</div>`;
        propertyHtml += `<div class="peb-input-container">`;
        if(properties['paddingTop'] !== undefined){
            propertyHtml += `<label class="">Top: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                data-attr="paddingTop"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['paddingTop']}"/>`
        }
        if(properties['paddingBottom'] !== undefined){
            propertyHtml += `<label class="">Bottom: </label><input class="ms-1 peb-input peb-num-input" type="number"
                data-attr="paddingBottom"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['paddingBottom']}"/>`
        }
        propertyHtml += `</div>`;

        propertyHtml += `<div class="peb-border-dash"></div>`;
        propertyHtml += `<div class="peb-input-container-header peb-justify-content-between mb-1">
                            <span>Background Styles:</span>
                        </div>`;
        propertyHtml += `<div class="peb-input-container">`;
        if (properties['backgroundImage'] !== undefined) {
            propertyHtml += `<label class="peb-nowrap">BG Image Link: </label><input class="ms-1 me-1 peb-input peb-w-100" type="text"
                data-attr="backgroundImage"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['backgroundImage']}"/>`
        }
        propertyHtml += `</div>`;
        propertyHtml += `<div class="peb-input-container">`;
        if (properties['backgroundSize'] !== undefined) {
            propertyHtml += `<label class="peb-nowrap">size: </label><select class="ms-1 me-1 peb-input" type="text"
                data-attr="backgroundSize"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onChange="changeOptionsValue(event)"
                value="${properties['backgroundSize']}">
                    <option>cover</option>
                    <option>contain</option>
                </select>`
        }
        if (properties['backgroundRepeat'] !== undefined) {
            propertyHtml += `<label class="peb-nowrap">Repeat: </label><select class="ms-1 me-1 peb-input" type="text"
                data-attr="backgroundRepeat"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onChange="changeOptionsValue(event)"
                value="${properties['backgroundRepeat']}">
                    <option>repeat</option>
                    <option>no-repeat</option>
                    <option>repeat-x</option>
                    <option>repeat-y</option>
                </select>`
        }
        propertyHtml += `</div>`;
        if(properties['radius'] !== undefined){
            propertyHtml += `<label class="">Radius: </label><input class="peb-input peb-num-input" type="number"
                data-attr="radius"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['radius']}"/>`
        }
        propertyHtml += `<div class="peb-input-container">`;
        if (properties['backgroundColor'] !== undefined) {
            propertyHtml += `<label class="">Background Color: </label><input class="ms-1 me-1 peb-color-input" type="color"
                data-attr="backgroundColor"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['backgroundColor']}"/><br/>`
        }
        if (properties['color'] !== undefined) {
            propertyHtml += `<label class="">Text Color: </label><input class="ms-1 me-1 peb-color-input" type="color"
                data-attr="color"
                data-component="block-property"
                data-blockindex="${index}"
                data-id="${idName}"
                onInput="changeOptionsValue(event)"
                value="${properties['color']}"/><br/>`
        }
        propertyHtml += `</div>`;

        if (properties['textAlign'] !== undefined) {
            propertyHtml += `<hr/>`
            propertyHtml += `<div class="">`
            propertyHtml += `<button class="m-1"
                    data-attr="textAlign"
                    data-component="alignment"
                    data-blockindex="${index}"
                    data-value="left"
                    data-id="${idName}"
                    onClick="changeOptionsValue(event)" >LEFT</button>`;
            propertyHtml += `<button class="m-1"
                    data-attr="textAlign"
                    data-component="alignment"
                    data-blockindex="${index}"
                    data-value="center"
                    data-id="${idName}"
                    onClick="changeOptionsValue(event)" >CENTER</button>`;
            propertyHtml += `<button class="m-1"
                    data-attr="textAlign"
                    data-component="alignment"
                    data-blockindex="${index}"
                    data-value="right"
                    data-id="${idName}"
                    onClick="changeOptionsValue(event)" >RIGHT</button>`;
            propertyHtml += `</div>`;
            propertyHtml += `<hr/>`;
        }
        /*---------------------------------*/
        let buttonHtml = ``;
        if(properties['type'] === 'button' && properties.components !== undefined){
            buttonHtml += `<div class="peb-input-container-header peb-justify-content-between"><span>Button Properties:</span> <button class="peb-btn peb-btn-primary peb-btn-xs" data-id="${idName}" data-blockindex="${index}" onClick="addMoreButton(event)">+ Add More Button</button></div>`;
            Object.keys(properties.components).forEach(componentIndex => {
                buttonHtml += `<div class="peb-input-container">`;
                if(properties.components[componentIndex].buttonColor !== undefined){
                    buttonHtml += `<label class="">Text: </label><input class="ms-1 me-1 peb-color-input" type="color"
                                    data-attr="buttonColor"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonColor}"/>`
                }
                if(properties.components[componentIndex].buttonBackgroundColor !== undefined){
                    buttonHtml += `<label class="">Background: </label><input class="ms-1 me-1 peb-color-input" type="color"
                                    data-attr="buttonBackgroundColor"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonBackgroundColor}"/>`
                }
                if(properties.components[componentIndex].buttonBorderColor !== undefined){
                    buttonHtml += `<label class="">Border: </label><input class="ms-1 me-1 peb-color-input" type="color"
                                    data-attr="buttonBorderColor"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonBorderColor}"/>`
                }
                buttonHtml += `</div>`;
                if(properties.components[componentIndex].buttonText !== undefined){
                    buttonHtml += `<div class="peb-input-container"><label class="">Text: </label><input class="ms-1 peb-input peb-w-100"
                                    data-attr="buttonText"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonText}" placeholder="Enter button Text"/></div>`
                }
                if(properties.components[componentIndex].buttonLink !== undefined){
                    buttonHtml += `<div class="peb-input-container"><label class="">Link: </label><input class="ms-1 peb-input peb-w-100"
                                    data-attr="buttonLink"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonLink}" placeholder="Enter button url"/></div>`
                }
                buttonHtml += `<div class="peb-input-container">`;
                if(properties.components[componentIndex].buttonXMargin !== undefined){
                    buttonHtml += `<label class="">X-Margin: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                                    data-attr="buttonXMargin"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonXMargin}"/>`
                }
                if(properties.components[componentIndex].buttonYMargin !== undefined){
                    buttonHtml += `<label class="">Y-Margin: </label><input class="ms-1 peb-input peb-num-input" type="number"
                                    data-attr="buttonYMargin"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonYMargin}"/>`
                }
                buttonHtml += `</div>`;
                buttonHtml += `<div class="peb-input-container">`;
                if(properties.components[componentIndex].buttonXGap !== undefined){
                    buttonHtml += `<label class="">X-Gap: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                                    data-attr="buttonXGap"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonXGap}"/>`
                }
                if(properties.components[componentIndex].buttonYGap !== undefined){
                    buttonHtml += `<label class="">Y-Gap: </label><input class="ms-1 me-1 peb-input peb-num-input" type="number"
                                    data-attr="buttonYGap"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonYGap}"/>`
                }
                buttonHtml += `</div>`;
                if(properties.components[componentIndex].buttonRadius !== undefined){
                    buttonHtml += `<div class="peb-input-container"><label class="">Border Radius: </label><input class="ms-1 peb-input peb-num-input" type="number"
                                    data-attr="buttonRadius"
                                    data-component="button"
                                    data-blockindex="${index}"
                                    data-componentindex="${componentIndex}"
                                    data-id="${idName}"
                                    onInput="changeOptionsValue(event)"
                                    value="${properties.components[componentIndex].buttonRadius}"/></div>`
                }
                if(componentIndex > 0){
                    buttonHtml += `<div class="peb-input-container peb-justify-content-end">
                    <button class="peb-btn peb-btn-danger peb-btn-xs" style="margin-top:-32px" data-id="${idName}" data-blockindex="${index}" data-componentindex="${componentIndex}"
                    onClick="RemoveThisButton(event)">- Remove More Button</button></div>`;
                }
                buttonHtml += `<div class="peb-border-dash"></div>`;
            });
        }
        propertyHtml += buttonHtml;
        propertyHtml += `<br/><button id="getHtml" onClick="getQuillHtml()">generate Html</button>`

    }else{
    }
    document.getElementById('peb-option-container').innerHTML = propertyHtml;
}
/*-------------------------------------------------*/
/**
 * on click 'template-block' open settings bar
 * @param event
 */
function changeOptionsValue(event){
    let idName = null;
    let data_component = event.target.dataset.component
    let attr = event.target.dataset.attr
    if(data_component !== undefined){
        idName = event.target.dataset.id
        let block_index = event.target.dataset.blockindex;
        if(data_component === 'button'){
            let component_index = event.target.dataset.componentindex;
            templateObj.block[block_index].components[component_index][attr] = event.target.value
        }else if(data_component === 'alignment'){
            templateObj.block[block_index][attr] = event.target.dataset.value
        }else if(data_component === 'block-property'){
            templateObj.block[block_index][attr] = event.target.value
        }
    }else {
        templateObj.general[attr] = event.target.value
    }
    stylingHtmlByTemplateObj(idName);
}
function templateBlockClick(event) {
    let templateBlockChildId = event.currentTarget.querySelector('div:first-child').id;
    openOptionView(templateBlockChildId);
}

function deleteBlock(idName){
    let indexToRemove = templateObj.block.findIndex(item => item.id === idName);
    // Need a confirmation text. ??
    document.getElementById('block-'+idName).remove();
    templateObj.block.splice(indexToRemove, 1);
    let current_index = (indexToRemove - 1) < 0 ? 0 : (indexToRemove - 1);
    let current_comp = 'comp-' + templateObj.block[current_index].id
    setTimeout(function (){
        openOptionView(current_comp);
    },200)
}
/*-------------------------------------------------*/
function stylingHtmlByTemplateObj(idName = null, all_update = false){
    if(idName !== null){
        let buttonElement;
        let index = templateObj.block.findIndex(item => item.id === idName);
        let block_id = 'block-' + idName;
        let block_element = document.getElementById(block_id);
        Object.keys(templateObj.block[index]).forEach(attr => {
            block_element.style.padding = `${templateObj.block[index]['paddingTop']}px ${templateObj.block[index]['paddingRight']}px ${templateObj.block[index]['paddingBottom']}px ${templateObj.block[index]['paddingLeft']}px`;
            block_element.style.backgroundColor = templateObj.block[index]['backgroundColor'];
            block_element.style.backgroundImage = `url("${templateObj.block[index]['backgroundImage']}")`;
            block_element.style.backgroundSize = templateObj.block[index]['backgroundSize'];
            block_element.style.backgroundRepeat = templateObj.block[index]['backgroundRepeat'];
            block_element.style.color = templateObj.block[index]['color'];
            block_element.style.textAlign = templateObj.block[index]['textAlign'];
        });
        if(templateObj.block[index]['type'] === "button"){
            Object.keys(templateObj.block[index].components).forEach(componentIndex => {
                let button_id = 'button-'+componentIndex + '-' + idName;
                buttonElement = document.getElementById(button_id);
                buttonElement.href = templateObj.block[index].components[componentIndex].buttonLink !== undefined ? templateObj.block[index].components[componentIndex].buttonLink : '#';
                buttonElement.textContent = templateObj.block[index].components[componentIndex].buttonText !== undefined ? templateObj.block[index].components[componentIndex].buttonText : buttonElement.href;
                buttonElement.style.padding = `${templateObj.block[index].components[componentIndex].buttonYGap}px ${templateObj.block[index].components[componentIndex].buttonXGap}px`;
                buttonElement.style.margin = `${templateObj.block[index].components[componentIndex].buttonYMargin}px ${templateObj.block[index].components[componentIndex].buttonXMargin}px`;
                buttonElement.style.backgroundColor = templateObj.block[index].components[componentIndex].buttonBackgroundColor;
                buttonElement.style.color = templateObj.block[index].components[componentIndex].buttonColor;
                buttonElement.style.border = `1px solid ${templateObj.block[index].components[componentIndex].buttonBorderColor}`;
                buttonElement.style.borderRadius = `${templateObj.block[index].components[componentIndex].buttonRadius}px`;
            });
        }
    }else{
        let element = document.getElementById('peb-template-container');
        element.style.padding = `${templateObj.general.paddingTop}px ${templateObj.general.paddingRight}px ${templateObj.general.paddingBottom}px ${templateObj.general.paddingLeft}px`;
        element.style.backgroundColor = templateObj.general.backgroundColor;
        element.style.backgroundImage = `url("${templateObj.general.backgroundImage}")`;
        element.style.backgroundSize = templateObj.general.backgroundSize;
        element.style.backgroundRepeat = templateObj.general.backgroundRepeat;
        element.style.color = templateObj.general.color;
        if(all_update){
            console.log('all_update');
            Object.keys(templateObj.block).forEach(i => {
                let block_element = document.getElementById('block-' + templateObj.block[i].id);
                console.log(templateObj.block[i].id);
                block_element.style.padding = `${templateObj.block[i]['paddingTop']}px ${templateObj.block[i]['paddingRight']}px ${templateObj.block[i]['paddingBottom']}px ${templateObj.block[i]['paddingLeft']}px`;
                block_element.style.backgroundColor = templateObj.block[i]['backgroundColor'];
                block_element.style.backgroundImage = `url("${templateObj.block[i]['backgroundImage']}")`;
                block_element.style.backgroundSize = templateObj.block[i]['backgroundSize'];
                block_element.style.backgroundRepeat = templateObj.block[i]['backgroundRepeat'];
                block_element.style.color = templateObj.block[i]['color'];
                block_element.style.textAlign = templateObj.block[i]['textAlign'];
            });
        }
    }
}

function parseHtmlByTemplateObj(){
    console.log(templateObj);
    let html = ``;
    let initial_comp = ``;
    Object.keys(templateObj.block).forEach(index => {
        let propertyObj = templateObj.block[index];
        if(index === 0){
            initial_comp = 'comp-' + propertyObj.id
        }
        html += `<div class="template-block" data-blocktype="${propertyObj.type}" id="blok-${propertyObj.id}">`;
        if(propertyObj.type === 'button'){
            html += buttonComponent(propertyObj).html;
        }
        html += makeIndicatorAction(propertyObj.id)
        html += `</div>`;

    });
    document.getElementById('peb-template-container').innerHTML = html;
    return initial_comp;
}

/*===================================================================================================================================================*/
/*===================================================================================================================================================*/
/*===================QUILL=======================*/
const quillInstances = [];
function loadQuills(containers) {
    if (containers.length > 0) {
        containers.map((container) => {
            let quill = new Quill(container, {
                modules: {
                    toolbar: [
                        [{'size': []}, {'header': '1'}, {'header': '2'}],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'color': []}, {'background': []}],
                        [{'script': 'super'}, {'script': 'sub'}],
                        ['blockquote', 'code-block'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, {'align': []}],
                        ['link', 'image', 'video'],
                    ]
                },
                theme: 'bubble',
            });
            quillInstances.push(quill);
        });
    }
}

function getQuillHtml() {
    quillInstances.forEach((quill, index) => {
        // quill.container.id
        console.log(quill.root.innerHTML)
    });
    console.log(templateObj);
}
/*===================QUILL END=======================*/
/*-------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function() {
    var el1 = document.getElementById("peb-template-container");
    // Disable all anchor links under el1 using event delegation
    el1.addEventListener("click", function(event) {
        var target = event.target;
        if (target.tagName === "A") {
            event.preventDefault();
        }
    });
});
function randomStr(length) {
    for (var s = ''; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random() * 62 | 0)) ;
    return s;
}




