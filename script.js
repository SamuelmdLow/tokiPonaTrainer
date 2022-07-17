class Term
{
    constructor(word, translate, expanded)
    {
        this.word = word;
        this.translate = translate;
        this.expanded = expanded;

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
            if (weakest > list[i].accuracy)
            {
                weakest = list[i].accuracy;
            }
        }

        return weakest;
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
        terms.addWord(new Term(term[0], term[2], term[1]));
    }

    currentWord = terms.nextWord(round);
    //alert(currentWord.word);
    document.getElementById("word").innerHTML = currentWord.word;
}

function submit()
{
    //alert(document.getElementById("input").value);
    if (currentWord.translate == document.getElementById("input").value)
    {
        currentWord.timesCorrect = currentWord.timesCorrect + 1;
        document.getElementById("wordBox").style.backgroundColor = "#a3f593";
        document.getElementById("wordBox").borderColor = "#7cba70";
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
    document.getElementById("word").innerHTML = currentWord.word;
}

loadDoc();
window.setTimeout(onload, 10);
