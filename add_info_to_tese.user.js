// ==UserScript==
// @name        add info to tese
// @namespace   ist_info_tese
// @include     https://fenix.tecnico.ulisboa.pt/student/finalists/studentCandidacies*
// @include     https://fenix.tecnico.ulisboa.pt/studentCandidacies*
// @version     1
// @grant       none
// ==/UserScript==

$("#candidaciesTable > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1)").text("Id Tese");
$("#candidaciesTable > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4)").text("Nº Can dida turas");

var oops =$("#candidaciesTable >thead>tr").children().first();
oops.after($(document.createElement('th')).text("Botões++"))
oops.after($(document.createElement('th')).text("S"))

//adds a new column for observations
$(".detailsButton").each(function( index ) {
   var text = $( this ).data("observations")
   var td_element = $( this ).parent().parent().parent();
   td_element.before("<td>"+text +"<td>");
   //td_element.before("<td>"+$( this ).data("requirements") +"<td>");
   //console.log( index + ": " +  );
});
console.log("Observations script ran correctly");


///////////////////////////////
///////////////////////////////
function getIdFromTr(element){
     var tr = $(element).parent().parent();
    //console.log("tr",tr)
    var id = tr.children().first().text();
    
    return { id:parseInt(id),
             tr:tr 
         };
}

function getIdAndStatus(element){
    var tr = $(element).parent().parent();
    //console.log("tr",tr)

    var id = tr.children().first().text();
    var text = element.text();
    
    return { id:parseInt(id),
             text:text,
             tr:tr 
         };
}

var scores_teses = loadFromStorage("scores_teses"); // obj with tese_id (id) -> score
var obj_atribuidas = loadFromStorage("obj_atribuidas");

console.log("obj_atribuidas", obj_atribuidas);

const TEXT_ATRIBUIDA = "Atribuída";
const TEXT_NAO_ATRIBUIDA = "Não atribuída";


$(".label").each(function( index ) {
    var el = $(this);
    var obj = getIdAndStatus(el);
    var id_td = obj.tr.children().first();
    
    if(obj.id in obj_atribuidas){
        console.log(obj.id, "exists");
        
        if(obj.text === TEXT_NAO_ATRIBUIDA){
            obj_atribuidas[obj.id] = TEXT_ATRIBUIDA;
            el.removeClass("label-success");
            el.addClass("label-warning");
            el.text(TEXT_ATRIBUIDA);
            el.after("<span>_</span>")
        }
    }

    // scoring
    /*
    $( this ).prepend(
       $(document.createElement('input')).attr({
           id:    'myCheckbox'
          ,name:  'myCheckbox'
          ,value: 'myValue'
          ,type:  'checkbox'
       })
    );
    */
    let td = $(document.createElement('td'));
    td.append($(document.createElement('input')).attr({
               id:    'rem'
              ,value: '-'
              ,type:  'button'
              ,class: 'butt minus_'
           })
    );
    td.append($(document.createElement('input')).attr({
               id:    'add'
              ,value: '+'
              ,type:  'button'
              ,class: 'butt add_'
           })
    );

    td.append($(document.createElement('input')).attr({
               id:    'zero'
              ,value: '0'
              ,type:  'button'
              ,class: 'butt zero_'
           })
    );
    td.append($(document.createElement('input')).attr({
               id:    'ten'
              ,value: '10'
              ,type:  'button'
              ,class: 'butt ten_'
           })
    );

    id_td.after(td);
    id_td.after($(document.createElement('td')).addClass("score"));

    if(obj.id in scores_teses){
        console.log("id in score",obj.id)
        let scr = obj.tr.find(".score");
        if(scr !== undefined){
            scr.text(scores_teses[obj.id]);
        }
        
    }
});

$(".butt").css("margin","3px");
$(".butt").css("padding","3px");

$(".minus_").on('click', function(){
    
    let obj = getIdFromTr(this);
    let id = obj.id;
    if(scores_teses[id] == undefined)
        scores_teses[id] = 5;
    else if(scores_teses[id] > 0)
        scores_teses[id]--;

    obj.tr.find(".score").text(scores_teses[id]);
    localStorage.scores_teses = JSON.stringify(scores_teses);
});

$(".add_").on('click', function(){

    let obj = getIdFromTr(this);
    let id = obj.id;
    if(scores_teses[id] == undefined)
        scores_teses[id] = 5;
    else if(scores_teses[id] < 10)
        scores_teses[id]++;

    obj.tr.find(".score").text(scores_teses[id]);
    localStorage.scores_teses = JSON.stringify(scores_teses);
});

$(".zero_").on('click', function(){

    let obj = getIdFromTr(this);
    scores_teses[obj.id] = 0;

    obj.tr.find(".score").text(scores_teses[obj.id]);
    localStorage.scores_teses = JSON.stringify(scores_teses);
});

$(".ten_").on('click', function(){

    let obj = getIdFromTr(this);
    scores_teses[obj.id] = 10;

    obj.tr.find(".score").text(scores_teses[obj.id]);
    localStorage.scores_teses = JSON.stringify(scores_teses);
});



$( ".label" ).click(function() {
    var el = $(this);
    var obj = getIdAndStatus(el);
        
    console.log(obj);
    
    if(obj.text === TEXT_NAO_ATRIBUIDA){
        obj_atribuidas[obj.id] = TEXT_ATRIBUIDA;
        el.removeClass("label-success");
        el.addClass("label-warning");
        el.text(TEXT_ATRIBUIDA);
        //if(el.parent)
        let under = el.parent().children().last();
        //console.log("under", under.text());
        if(under.text() !=="_"){
            //console.log("s")
            el.after("<span>_</span>")
        }
        
        localStorage.obj_atribuidas = JSON.stringify(obj_atribuidas);
    }else{
        if(obj.id in obj_atribuidas){
            delete obj_atribuidas[obj.id];
            el.removeClass("label-warning");
            el.addClass("label-success");
            el.text(TEXT_NAO_ATRIBUIDA);
            localStorage.obj_atribuidas = JSON.stringify(obj_atribuidas);
        }else
            console.log("cant force this to be open :(")
    }

    console.log(obj_atribuidas);
});



function loadFromStorage(varName) {
    if (localStorage[varName] == undefined)
        return {};
    else
        return JSON.parse(localStorage[varName]);
}

////////////////////////
////////////////////////
//    SORT TABLES
////////////////////////
////////////////////////


$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    //console.log("table",table)

    //console.log("rows",table.find('tr:gt(0)'))
    
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    

    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})


function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}

    
function getCellValue(row, index){ return $(row).children('td').eq(index).html() }
