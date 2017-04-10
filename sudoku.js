var m = [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
];

function makeMatrix(){
    var matrix=[];
    matrix=m;
    return matrix;
}

function makeDisplayMatrix(difficulty){
    var arr = [];
    var displayedDesired=9-difficulty;
    var actualDisplayed;
    var chosen;
    for(var i =0; i<10; i++){
        arr[i]=[];
        for(var j=0; j<10; j++){
            arr[i].push(false);
        }
        actualDisplayed=0;
        while(actualDisplayed<displayedDesired){
            chosen=Math.floor(Math.random()*9);
            if(arr[i][chosen] === false){
                arr[i][chosen] = true;
                actualDisplayed++;
            }
        }
    }
    return arr;
}

function checkMatrix(m){
    var groups = [];
    var n
    for(var i=0; i<9; i++){
        groups[i]=m[i];
    }
    for(i=0;i<9;i++){
        groups[i+8]=[];
        for(var j=0; j<9; j++){
            groups[i+8].push(m[j][i])
        }
    }

    for(i=0;i<9;i++){
        groups[i+18]=[];
        for(j=0;j<3;j++){
            for(var k=0; k<3; k++) {
                groups[i+18].push(m[Math.floor(i/3)*3+j][(i%3)*3+k])
            }
        }
    }
    var valid=true;
    groups.forEach(function(g){
        for(var i = 1; i<10; i++)
            valid=valid && !!~g.indexOf(i);
        valid = valid && g.length === 9;
    });
    return valid;
}

function validateBoard(){

}

console.log('script running');
function createBoard(difficulty){
    if(!isFinite(difficulty) || difficulty <1 || difficulty > 4){
        difficulty=1;
    } else {
        difficulty=Math.floor(difficulty);
    }

    difficulty += 3;
    var board = document.getElementById('board');
    function create(type){
        return document.createElement(type);
    }
    var table = create('table');
    var row, cell, input;
    var matrix = makeMatrix();
    var displayMatrix = makeDisplayMatrix(difficulty);
    for(var i=0; i<9; i++){
        row = create('tr');
        row.setAttribute('data-row', i);
        for(var j=0; j<9; j++){
            cell=create('td');
            cell.setAttribute('data-column', j);
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-value', matrix[i][j]);
            cell.setAttribute('data-group', Math.floor(i/3)*3 + Math.floor(j/3));
            if(displayMatrix[i][j]) {
                cell.innerHTML = matrix[i][j];
                cell.setAttribute('data-displayed', true);
            } else {
                cell.setAttribute('data-displayed', false);
                input = create('input');
                input.setAttribute('type', 'number');
                input.setAttribute('min', 0);
                input.setAttribute('max', 9);
                input.addEventListener('change',function(e){
                    console.log('change occured');
                    function normalize(list){
                        list = Array.prototype.slice.call(list);
                        list = list.map(function(el){
                            var val;
                            if(el.getAttribute('data-displayed') === 'true') {
                                val=el.getAttribute('data-value');
                            } else {
                                val=el.querySelector('input').value;
                            }
                            val= +val;
                            return val;
                        });
                        return list;
                    }

                    function validate(list){
                        var valid = true;
                        for(var i = 1; i<10; i++)
                            valid=valid && !!~list.indexOf(i);
                        valid = valid && list.length === 9;
                        return valid;
                    }

                    function hasDupes(valsList, elsList, log){
                        !log?0:('checking for dupes');
                        var hasDupes = false;
                        var counts={};
                        var num;
                        for(var i=0; i<valsList.length; i++){
                            num = valsList[i];
                            counts[num] = counts[num] ? counts[num] + 1 : 1;
                        }
                        !log?0:(counts);
                        for(key in counts){
                            if(counts.hasOwnProperty(key) && counts[key] > 1 && +key !== 0) {
                                !log?0:(key);
                                valsList.forEach(function(val, index){
                                    !log?0:(elsList);
                                    var el=elsList[index];
                                    if(val == key){
                                        !log?0:(el);
                                        el.classList.remove('valid');
                                        el.classList.add('dupe');
                                    }
                                })
                                hasDupes = true;
                            }
                        }
                        !log?0:(hasDupes);
                        for(vari=0;i<9;i++){
                            if(hasDupes)
                                elsList[i].classList.remove('valid');
                            else
                                elsList[i].classList.remove('dupe');
                        }
                        return hasDupes;
                    }

                    var cell = e.target.parentElement
                    console.log(cell);
                    var row = cell.getAttribute('data-row');
                    var col = cell.getAttribute('data-column');
                    var group = cell.getAttribute('data-group');

                    console.log('row='+row);
                    console.log('col='+col);
                    console.log('group='+group);


                    row = document.querySelectorAll('td[data-row="'+row+'"]');
                    col = document.querySelectorAll('td[data-column="'+col+'"]');
                    group = document.querySelectorAll('td[data-group="'+group+'"]');

                    var rowVals = normalize(row);
                    console.log(row);
                    console.log(rowVals);

                    var colVals = normalize(col);
                    console.log(col);
                    console.log(colVals);

                    var groupVals = normalize(group);
                    console.log(group);
                    console.log(groupVals);
                    
                    console.log('row');
                    var rowDupes = hasDupes(rowVals, row);
                    console.log('col');
                    var colDupes = hasDupes(colVals, col);
                    console.log('group');
                    var groupDupes = hasDupes(groupVals, group);
                    var i;

                    console.log('row');
                    console.log(row);
                    if(!rowDupes && validate(rowVals)){
                        for(i=0; i<9; i++){
                            console.log(i)
                            row[i].classList.remove('dupe');
                            row[i].classList.add('valid');
                        }
                    }

                    if(!colDupes && validate(colVals)){
                        for(i=0; i<9; i++){
                            col[i].classList.remove('dupe');
                            col[i].classList.add('valid');
                        }
                    }

                    if(!groupDupes && validate(groupVals)){
                        for(i=0; i<9; i++){
                            group[i].classList.remove('dupe');
                            group[i].classList.add('valid');
                        }
                    }

                    if(document.querySelectorAll('td.valid').length === 81)
                        alert('You win');
                    // return rowDupes && colDupes && groupDupes;
                });
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    board.innerHTML="";
    board.appendChild(table);
    console.log('created');
}
document.addEventListener('DOMContentLoaded', createBoard);