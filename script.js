class Term
{
    constructor(word, translate, expanded, symbol)
    {
        this.word = word;
        this.translate = translate;
        this.expanded = expanded;
        this.symbol = symbol;

        this.lastUsed = -100;
        this.timesAnswered = 0;
        this.timesCorrect = 0;
        this.accuracy = 0.5;

        this.rankingValue = null;
    }

    updateAccuracy()
    {
        this.accuracy = this.timesCorrect/this.timesAnswered;
    }
}

class Terms
{
    constructor()
    {
        this.list = [];
    }

    addWord(word)
    {
        this.list.push(word);
    }

    weakestLink()
    {
        var weakest = this.list[0].accuracy;
        for(let i = 0; i < this.list.length; i++)
        {
            if (weakest > this.list[i].accuracy)
            {
                weakest = this.list[i].accuracy;
            }
        }
        console.log(weakest);
        weakest = (weakest-0.5)/0.5;
        weakest = weakest.toFixed(2);
        console.log(weakest);
        return weakest;
    }

    average()
    {
        var sum = 0;
        for(let i = 0; i < this.list.length; i++)
        {
            if (this.list[i].accuracy != 0.5)
            {
                sum = sum + this.list[i].accuracy;
            }
        }
        var ave = sum/this.list.length;
        return ave.toFixed(1);
    }

    nextWord(round)
    {
        for(let i = 0; i < this.list.length; i++)
        {
            var gap = round - this.list[i].lastUsed;
            if (gap > 3)
            {
                this.list[i].rankingValue = this.list[i].accuracy/gap;
            }
            else
            {
                this.list[i].rankingValue = 100;
            }
            //console.log(this.list[i].word + ' ' +  gap + ' ' + this.list[i].rankingValue);
        }

        this.list.sort(function(a, b){return a.rankingValue - b.rankingValue});
        return this.list[0];
    }

}

var round = 0;
var terms = new Terms();
var currentWord;
var words;
var correct = 0;
var type;

function setType(num)
{
    type = num;
}

function loadDoc(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
        {
            words = this.responseText;
            //document.getElementById("hidden").value = this.responseText;
        }
    };
    xhttp.open("GET", "tokipona.txt", true);
    xhttp.send();
}

function onload()
{
    //words = document.getElementById("hidden").value;
    //alert(words);
    words = words.split("\n");
    for (let i=0;i<words.length;i++)
    {
        term = words[i].substr(0,words[i].length -1);
        term = term.split(",");
        terms.addWord(new Term(term[0], term[2], term[1], term[3]));
    }

    currentWord = terms.nextWord(round);
    //alert(currentWord.word);
    if (type == 0)
    {
        document.getElementById("word").innerHTML = currentWord.word;
    }
    else if (type == 1)
    {
        document.getElementById("word").innerHTML = currentWord.translate;
    }
    else if (type == 2)
    {
        document.getElementById("symbol").src = currentWord.symbol;
    }
}

function submit()
{
    //alert(document.getElementById("input").value);
    var answer;
    if (type == 0)
    {
        answer = currentWord.translate;
    }
    else
    {
        answer = currentWord.word;
    }

    if (answer == document.getElementById("input").value)
    {
        currentWord.timesCorrect = currentWord.timesCorrect + 1;
        document.getElementById("wordBox").style.backgroundColor = "#a3f593";
        document.getElementById("wordBox").borderColor = "#7cba70";

        if (currentWord.timesCorrect == 1)
        {
            correct = correct + 1;
            document.getElementById("progress").innerHTML = correct + "/" + terms.list.length
        }

    }
    else
    {
        document.getElementById("wordBox").style.backgroundColor = "#f59393";
        document.getElementById("wordBox").borderColor = "#ba7070";

    }

    document.getElementById("past word").innerHTML = currentWord.word + ": " + currentWord.translate;
    document.getElementById("expanded").innerHTML = currentWord.expanded;

    currentWord.timesAnswered = currentWord.timesAnswered + 1;
    currentWord.updateAccuracy();
    currentWord.lastUsed = round;
    round = round + 1;

    //terms.list[0] = currentWord;
    document.getElementById("input").value = "";
    document.getElementById("input").select();

    currentWord = terms.nextWord(round);

    if (type == 0)
    {
        document.getElementById("word").innerHTML = currentWord.word;
    }
    else if (type == 1)
    {
        document.getElementById("word").innerHTML = currentWord.translate;
    }
    else if (type == 2)
    {
        document.getElementById("symbol").src = currentWord.symbol;
    }

    document.getElementById("ave").innerHTML = terms.average();
    if (terms.average() < 0.3)
    {
        document.getElementById("ave").style.backgroundColor = "#db6565";
    }
    else if (terms.average() < 0.8)
    {
        document.getElementById("ave").style.backgroundColor = "#dbc165";
    }
    else
    {
        document.getElementById("ave").style.backgroundColor = "#7ddb65";
    }

}

loadDoc();
window.setTimeout(onload, 500);
