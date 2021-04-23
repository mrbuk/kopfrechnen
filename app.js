aufgabeToString = (task) => { return task.x + ";" + task.y }

UebergangPlus = () => {
    UebergangAllgemein(10, 10, '+', (aufgabe) => {
        return (aufgabe.x + aufgabe.y) >= 10 &&
                (aufgabe.x + aufgabe.y) < 20
    })
}

UebergangMinus = () => {
    UebergangAllgemein(19, 12, '-', (aufgabe) => {
        return aufgabe.x > aufgabe.y &&
                aufgabe.x >= 10 &&
                (aufgabe.x - aufgabe.y) < 10
    })
}

UebergangAllgemein = (xMax, yMax, operator, condition) => {
    data.aufgabeList = []
    var aufgabenStringList = []

    for(i = 0; i < 15; i++) {    
        var x, y;
        var conditionsMet = false
        do {
            x = Math.floor(Math.random() * xMax) + 1;
            y = Math.floor(Math.random() * yMax) + 1;
            
            aufgabe = {id: i, operator: operator, x: x, y: y}

            s = aufgabeToString(aufgabe)
            aufgabeDoesntExist = aufgabenStringList.indexOf(s) == -1

            // vermeide Duplikate
            if (aufgabeDoesntExist && condition(aufgabe)) {
                aufgabenStringList.push(aufgabe)
                conditionsMet = true
                data.aufgabeList.push(aufgabe)
            }
        } while (!conditionsMet)
    }
}


Vue.component('aufgabe-item', {
    props: ['aufgabe'],
    computed: { 
        ergebnis: function() {
            a = this.aufgabe
            if (a.operator == "+") {
                return a.x + a.y
            }
            else if (a.operator == "-") {
                return a.x - a.y
            }
        }
    },
    watch: {
       'aufgabe.eingabe': function(value) {
           if (value == this.ergebnis) {
               this.aufgabe.pruefung = "richtig!"
           }
       } 
    },
    template: `
        <div class="table-row">
            <div class="table-cell">{{ aufgabe.x }}</div>
            <div class="table-cell">&nbsp;{{ aufgabe.operator }}&nbsp;</div>
            <div class="table-cell">{{ aufgabe.y }}</div>
            <div class="table-cell">&nbsp;=&nbsp;</div>
            <div class="table-cell"><input v-model="aufgabe.eingabe" size="3"></div>
            <div class="table-cell">&nbsp;{{ aufgabe.pruefung }}&nbsp;</div>
        </div>`
})

var data = {
    aufgabeList: []
}

var app = new Vue({
    el: '#app',
    data: data, 
    methods: {
        UebergangPlus: UebergangPlus,
        UebergangMinus: UebergangMinus
    }
})
