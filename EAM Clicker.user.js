// ==UserScript==
// @name			EAM Clicker
// @description		EAM Clicker
// @author			aIeksander
// @match			https://mingle-portal.eu1.inforcloudsuite.com/AMAZONRMEEU_PRD*
// @downloadURL		https://github.com/aIeksancler/EAM-Clicker/raw/main/EAM%20Clicker.user.js
// @updateURL		https://github.com/aIeksancler/EAM-Clicker/raw/main/EAM%20Clicker.user.js
// @version			4.48
// @grant			none
// @run-at			document-end
// ==/UserScript==

//GM_addStyle, GM_xmlhttpRequest


// update with your EAM language
const arr_checkbox_text_to_click = ['Yes:',
                                    'Completed:',
                                    'Tak:',
                                    'Zakończone:',
                                    'Ja:',
                                    'Abgeschlossen:']

const hours_selection = ['-1', '-0.5', '-0.25', '+0.25', '+0.5', '+1']

var grid_result_cells;
var currentPanel;
var currentIframe;

const kablociag = ['Enterprise Asset Management',
                   '♩ Wypiekają chleb piekarze, ♪',
                   '♩ wyrabiają stal hutnicy, ♬',
                   '♫ krawcy gacie, szewcy buty, ♪',
                   '♬ a my ciągnim druty. ♩',
                   '♪ Hej chwyćmy kabla w dłonie, ♫',
                   '♬ hej ciągmy razem w kupie, ♬',
                   '♩ bo jak zabraknie prądu ♩',
                   '♫ ludzkość będzie w dupie. ♪',
                   '♬ Raz pod wodą, raz pod ziemią, ♩',
                   '♩ raz na górze, raz w dolinie, ♫',
                   '♪ ciągnij bracie, ciągnij kabla, ♩',
                   '♩ bo nim prąd popłynie. ♪',
                   '♫ Hej chwyćmy kabla w dłonie, ♫',
                   '♩ hej ciągmy razem w kupie, ♬',
                   '♪ hej ciągmy ile siły, ♪',
                   '♬ reszte miejmy w dupie. ♩',
                   'Enterprise Asset Management']



console.log('Script Loaded');


function scrollToLast(callback){
    //console.log('Clicked')
    try{
        var load_completed = false
        var x, y = 0;
        var intervalTimeout = 0
        var count = 0
        var scrollInterval = setInterval(function(){

            // search for list elements (checklist)

            var list_elements = currentPanel.getElementsByClassName('x-grid-item');

            console.log('Found ' + list_elements.length + ' grid items.');
            if (list_elements.length > 0){

                list_elements[list_elements.length - 1].scrollIntoView();
                //waitForProcessing();

                // search for grid containing checklist
                var records_toolbar_text = currentPanel.getElementsByClassName('x-toolbar-text x-box-item x-toolbar-item x-toolbar-text-default');
                console.log('Records count field found: ' + records_toolbar_text);

                // EAM has two grid elements opened - one for PMs, one for checklist; the first one is in the background
                // we have to check if the checklist is fully loaded by checking "records x of y" for x == y
                for(let i = 0; i < records_toolbar_text.length; i++){
                    // checklist grid has 'checklistgrid' in it's ID
                    //console.log(i)
                    var records_toolbar_text_temp = records_toolbar_text[i];

                    while(records_toolbar_text_temp.parentNode &&
                          records_toolbar_text_temp.parentNode.nodeName.toLowerCase() != 'body') {


                        records_toolbar_text_temp = records_toolbar_text_temp.parentNode;
                        //console.log(records_toolbar_text_temp.id)
                        if(records_toolbar_text_temp.id.includes('checklistgrid')){
                            console.log('chcklistgrid found');
                            // extract records number from the string
                            var records_number = records_toolbar_text[i].textContent.split(' ').filter(Number);
                            // check for x == y
                            x = parseInt(records_number[0]);
                            y = parseInt(records_number[1]);
                            if (x === 0 && y === 0){
                                return callback(false);
                            }
                            if (intervalTimeout === 0){
                                intervalTimeout = y / x + 1;
                            }
                        }

                    }
                }
                console.log('Records ' + x + ' of ' + y);
                //console.log(x < y)

                count++;
                if ( count === intervalTimeout || x === y || count > 10){
                    console.log('Scrolling finished');
                    clearInterval(scrollInterval);
                    if ( x !== y) { return callback(false); }
                    else { return callback(true); }
                }
            }
            else{
                clearInterval(scrollInterval);
                return callback(true);
            }

            // scroll to last element
            //console.log('Last clicked index: ' + list_elements.length + ' element id: ' + list_elements[list_elements.length - 1].id);
        }, 500);
    } catch (error){
        clearInterval(scrollInterval)
        console.error(error);
    }
    callback();
}

function f_checkAll(e) {
    //console.log('Button parent element id: ' + event.target.parentElement.id);
    console.log('Grid id: ' + this.id);
    try{
        currentPanel = e.srcElement.parentNode.parentNode.parentNode;
        console.log( typeof currentPanel !== undefined);
        if (typeof currentPanel !== 'undefined'){
            scrollToLast(function(value){
                console.log('scrollToLast return value: ' + value)
                if (value){
                    var count = 0;
                    var list_elements = currentPanel.getElementsByClassName('x-field x-form-item x-form-item-default x-form-type-checkbox x-box-item x-hbox-form-item');

                    for(let i = 0; i < list_elements.length; i++){
                        var label_text = list_elements[i].textContent.trim();
                        //console.log(label_text + ' ' +  arr_checkbox_text_to_click.includes(label_text))
                        // check if label text is in the text to be clicked array
                        if (arr_checkbox_text_to_click.includes(label_text)){
                            // change element from label to checkbox
                            // if checkbox is not checked, click it
                            if (!list_elements[i].classList.contains('x-form-cb-checked')){
                                count++;
                                // click on checkbox
                                list_elements[i].firstChild.click();
                            }
                            //console.log(div[i].id.replace('-labelTextEl', '-inputEl'));
                        }
                    }
                    console.log('Clicked: ' + count);

                }
            });
        }
        return true;
    } catch (error){
        console.error(error);
        return false;
    }
}

function f_checkAllWO(e, iframe) {
    //console.log('Button parent element id: ' + event.target.parentElement.id);
    let nextButton = iframe.getElementsByClassName('x-btn-icon-el x-btn-icon-el-default-toolbar-small toolbarNext')[0].parentNode.parentNode.parentNode;
    let saveButton = iframe.getElementsByClassName('x-btn-icon-el x-btn-icon-el-default-toolbar-small toolbarSave')[0];
    let processing = iframe.getElementsByClassName('x-masked');

    console.log('Grid id: ' + this.id);
    try{
        currentPanel = e.srcElement.parentNode.parentNode.parentNode;
        console.log( typeof currentPanel !== undefined);
        if (typeof currentPanel !== 'undefined'){
            scrollToLast(function(value){
                console.log('scrollToLast return value: ' + value)
                if (value){
                    var count = 0;
                    var list_elements = currentPanel.getElementsByClassName('x-field x-form-item x-form-item-default x-form-type-checkbox x-box-item x-hbox-form-item');

                    for(let i = 0; i < list_elements.length; i++){
                        var label_text = list_elements[i].textContent.trim();
                        //console.log(label_text + ' ' +  arr_checkbox_text_to_click.includes(label_text))
                        // check if label text is in the text to be clicked array
                        if (arr_checkbox_text_to_click.includes(label_text)){
                            // change element from label to checkbox
                            // if checkbox is not checked, click it
                            if (!list_elements[i].classList.contains('x-form-cb-checked')){
                                count++;
                                // click on checkbox
                                list_elements[i].firstChild.click();
                            }
                            //console.log(div[i].id.replace('-labelTextEl', '-inputEl'));
                        }
                    }
                    console.log('Clicked: ' + count);
                    if (!nextButton.classList.contains('x-btn-disabled')){
                        console.log('Next ' + nextButton.click());
                        // waitForEAM(function(value){
                        //     if (value){
                        //         setInterval(console.log('Repeating ' + e.srcElement.parentNode.firstChild.click()),
                        //                     1000);
                        //     }
                        // });
                        //waitForEAM(() => console.log('Processing done'));
                    }
                    else{
                        console.log('Saving last ' + saveButton.click());
                    }

                }

                // console.log('Next ' + nextButton.click());
                // if (nextButton.classList.contains('x-btn-disabled') === false){
                //     e.srcElement.click();
                // }
            });
        }

        return true;
    } catch (error){
        console.error(error);
        return false
    }
}

function f_uncheckAll(e) {
    try{
        currentPanel = e.srcElement.parentNode.parentNode.parentNode;
        if (typeof currentPanel !== 'undefined'){
            scrollToLast(function(value){
                if (value){
                    let count = 0;
                    var list_elements = currentPanel.getElementsByClassName('x-field x-form-item x-form-item-default x-form-type-checkbox x-box-item x-hbox-form-item');

                    for(let i = 0; i < list_elements.length-1; i++){
                        if (list_elements[i].classList.contains('x-form-cb-checked')){
                            count++;
                            // click on checkbox
                            list_elements[i].firstChild.click();
                        }
                        //console.log(div[i].id.replace('-labelTextEl', '-inputEl'));
                    }
                    console.log('Clicked: ' + count);
                }

            });
        }
        return true;
    }
    catch (error){
        console.error(error);
        return false;
    }
}

function f_fillLogin(e){
    try{
        if (employeeName !== '' && e.srcElement.value.length === 0){
            e.srcElement.value = employeeName;
            e.srcElement.removeEventListener('click', f_fillLogin);
        }
    }
    catch (error){
        console.error(error);

    }
}

// function f_fillTodaysDate(e){
//     try{
//         if (e.srcElement.value.length === 0){
//             console.log('Clicked space ' + e.srcElement.parentNode.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Space'})));
//         }
//     }
//     catch (error){
//         console.error(error);

//     }
// }

function f_fillHours(e, element, value){
    try{
        if (parseFloat(element.value)){
            element.value = parseFloat(element.value) + parseFloat(value);
        }
        else{
            element.value = parseFloat(value);
        }
    }
    catch (error){
        console.error(error);

    }
}

function f_toggleOT(e, element){
    try{
        if (element.value === 'N' || element.value === ''){
            element.value = 'O';
            e.srcElement.innerHTML = 'Normal :(';
        }
        else{
            element.value = 'N';
            e.srcElement.innerHTML = '$OT$';
        }
    }
    catch(e){
        console.error(e);
    }
}

let allDocuments = [document];
var employeeName = '';

// const timeout = setTimeout(stopInterval, 500);

let getEmployeeNameInterval = setInterval(function(){
    try{
        employeeName = document.getElementsByClassName('x-toolbar-text dbtext x-box-item x-toolbar-item x-toolbar-text-mainmenuButton-toolbar')[0].innerText;
        employeeName = employeeName.slice(employeeName.indexOf('(') + 1, employeeName.indexOf(')'));
        console.log('Found employee name: ' + employeeName);
        clearInterval(getEmployeeNameInterval);
    }
    catch (error){
        employeeName = '';
        console.error(error);
        console.log("Don't panic. Maybe it didn't show on the screen yet. ;)");
    }
}, 1000);

let verse = 0;

let refreshInterval = setInterval(function(){

    // collecting all iframes
    let iframes = document.querySelectorAll('[data-ref="iframeEl"]');
    // search iframes
    for (let i = 0; i < iframes.length; i++){
        if (!iframes[i].classList.contains('zwyroled')){
            allDocuments.push(iframes[i]);
            iframes[i].classList.add('zwyroled');
            console.log('Added document at index ' + (allDocuments.length - 1));
        }
    }


    // search iframes
    for (let i = 0; i < allDocuments.length; i++){
        //console.log('Zwyrolling iframe: ' + iframes[i].id);
        let iframe;
        currentIframe = iframe;
        //iframe = iframes[i].contentDocument || iframe[i].contentWindow.document;
        try{
            if (i > 0){
                iframe = allDocuments[i].contentDocument || allDocuments[i].contentWindow.document;
                // console.log(iframe = allDocuments[i].contentDocument || allDocuments[i].contentWindow.document);
            }
            else{
                iframe = allDocuments[0];
                // console.log(iframe = allDocuments[0]);
            }

            // name filling on click
            let employee_field = iframe.getElementsByName('employee');
            if(employee_field.length > 0){
                for (let i = 0; i < employee_field.length; i++){
                    if(!employee_field[i].classList.contains('zwyroled')){
                        employee_field[i].classList.add('zwyroled');
                        employee_field[i].parentNode.addEventListener('click',f_fillLogin);
                        //employee_field[i].parentNode.addEventListener('click',(event) => f_fillLogin(event, iframe));
                        //console.log(document.getElementsByClassNames('x-toolbar-text dbtext x-box-item x-toolbar-item x-toolbar-text-mainmenuButton-toolbar')[0].innerText.match(re)[1]);
                    }
                }
            }

            let assignedto_field = iframe.getElementsByName('assignedto');
            if(assignedto_field.length > 0){
                for (let i = 0; i < assignedto_field.length; i++){
                    if(!assignedto_field[i].classList.contains('zwyroled')){
                        assignedto_field[i].classList.add('zwyroled');
                        assignedto_field[i].parentNode.addEventListener('click',f_fillLogin);
                        //assignedto_field[i].parentNode.addEventListener('click',(event) => f_fillLogin(event, iframe));
                        //console.log(document.getElementsByClassNames('x-toolbar-text dbtext x-box-item x-toolbar-item x-toolbar-text-mainmenuButton-toolbar')[0].innerText.match(re)[1]);
                    }
                }
            }

            // let datework_field = iframe.getElementsByName('datework');
            // if(datework_field.length > 0){
            //     for (let i = 0; i < datework_field.length; i++){
            //         if(!datework_field[i].classList.contains('zwyroled')){
            //             datework_field[i].classList.add('zwyroled');
            //             datework_field[i].parentNode.addEventListener('click',f_fillTodaysDate);
            //             //datework_field[i].parentNode.addEventListener('click',(event) => f_fillLogin(event, iframe));
            //             //console.log(document.getElementsByClassNames('x-toolbar-text dbtext x-box-item x-toolbar-item x-toolbar-text-mainmenuButton-toolbar')[0].innerText.match(re)[1]);
            //         }
            //     }
            // }



            // adding checking buttons to any grid item
            let gridBodies = iframe.getElementsByClassName('x-panel-body x-grid-with-row-lines x-grid-body');

            for (let i = 0; i < gridBodies.length; i++){
                if (!gridBodies[i].classList.contains('zwyroled')){
                    gridBodies[i].classList.add('zwyroled');

                    let buttons_container = document.createElement('div');
                    buttons_container.style = 'position:absolute;top:0;left:320px';
                    buttons_container.name = 'buttonsContainer';

                    // button declaration
                    let button_checkAll = document.createElement('Button');
                    button_checkAll.name = 'Check all';
                    button_checkAll.innerHTML = 'Check all';
                    button_checkAll.classList.add('zwyrolButton');
                    button_checkAll.style = 'right:0;top:0;position:relative;margin:10px 5px'
                    button_checkAll.addEventListener('click',f_checkAll);
                    buttons_container.appendChild(button_checkAll);

                    let button_uncheckAll = document.createElement('Button');
                    button_uncheckAll.name = 'Uncheck all';
                    button_uncheckAll.innerHTML = 'Uncheck all';
                    button_uncheckAll.classList.add('zwyrolButton');
                    button_uncheckAll.style = 'right;0top:0;right:0;position:relative;margin:10px 5px'
                    button_uncheckAll.addEventListener('click',f_uncheckAll);
                    buttons_container.appendChild(button_uncheckAll);

                    let button_checkAllWO = document.createElement('Button');
                    button_checkAllWO.name = 'Check&Go';
                    button_checkAllWO.innerHTML = 'Check&Go';
                    button_checkAllWO.classList.add('zwyrolButton');
                    button_checkAllWO.style = 'right;0top:0;right:0;position:relative;margin:10px 5px'
                    button_checkAllWO.addEventListener('click',(event) => f_checkAllWO(event, iframe));
                    buttons_container.appendChild(button_checkAllWO);

                    gridBodies[i].parentElement.firstChild.appendChild(buttons_container);

                    console.log('Zwyroled gridBody ' + gridBodies[i].id + ' in iframe ' + iframe.id);
                }
            }
            let searchedFields

            // adding OT button
            searchedFields = iframe.getElementsByName('octype')
            for (let i = 0; i < searchedFields.length; i++){
                let element = searchedFields[i];
                //console.log(hoursWorkedElement.id);
                if (element.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('zwyroled').length === 0){

                    let buttons_container = document.createElement('div');
                    buttons_container.style = 'position:relative;top:0;left:10px';
                    buttons_container.name = 'hrsButtonsContainer';
                    buttons_container.classList.add('zwyroled');

                    let button = document.createElement("button");
                    button.innerHTML = '$OT$';
                    button.style = 'right:0;top:0;position:relative;margin:5px'

                    button.addEventListener('click',(event) => f_toggleOT(event, element));
                    buttons_container.appendChild(button);


                    element.parentNode.parentNode.parentNode.parentNode.appendChild(buttons_container);
                }
            }


            searchedFields = iframe.getElementsByName('hrswork')
            for (let i = 0; i < searchedFields.length; i++){
                let element = searchedFields[i];
                //console.log(hoursWorkedElement.id);
                if (element.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('zwyroled').length === 0){

                    let buttons_container = document.createElement('div');
                    buttons_container.style = 'position:relative;top:0;left:10px';
                    buttons_container.name = 'hrsButtonsContainer';
                    buttons_container.classList.add('zwyroled');

                    for (let i = 0; i < hours_selection.length; i++){
                        let button = document.createElement("button");
                        button.innerHTML = hours_selection[i];
                        button.style = 'right:0;top:0;position:relative;margin:5px 2px'

                        button.addEventListener('click',(event) => f_fillHours(event, element, hours_selection[i]));
                        buttons_container.appendChild(button);
                    }

                    element.parentNode.parentNode.parentNode.parentNode.appendChild(buttons_container);
                }
            }
        }
        catch (e){
            console.error(e);
            console.log('Removed null document at index: ' + i);
            allDocuments.splice(i, 1);
        }



    }


    if (Math.floor(verse/2)-5 < kablociag.length && Math.floor(verse/2)-5 >= 0) document.title = kablociag[Math.floor(verse/2) - 5];
    verse++;
    if (verse/2 > kablociag.length + 10) verse = 0;

}, 1000);













