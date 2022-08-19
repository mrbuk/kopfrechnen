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

UebergangMultiplizieren = () => {
    UebergangAllgemein(10, 10, '*', (aufgabe) => {
        return (aufgabe.x * aufgabe.y) <= 90
    })
}

UebergangDividieren = () => {
    UebergangAllgemein(90, 10, ':', (aufgabe) => {
        return aufgabe.x % aufgabe.y == 0 && aufgabe.x / aufgabe.y <= 10 && aufgabe.x > aufgabe.y
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

            if (aufgabeDoesntExist && condition(aufgabe)) {
                aufgabenStringList.push(s)
                conditionsMet = true

                data.aufgabeList.push(aufgabe)
            }
        } while (!conditionsMet)
    }

    app.startTimer()
}

Vue.component('aufgabe-item', {
    props: ['aufgabe'],
    data: function() {
        return {
            inputClass: "",
            disabled: false,
            duration: null
        }
    },
    computed: { 
        ergebnis: function() {
            a = this.aufgabe
            switch (a.operator) {
                case "+":
                    return a.x + a.y
                case "-":
                    return a.x - a.y
                case "*":
                    return a.x * a.y
                case ":":
                    return a.x / a.y
            }
        },
        durationText: function() {
            if (this.duration == null) {
                return ""
            }
            return this.duration + "s"
        }
    },
    methods: {
        pruefe: function() {
            if (this.aufgabe.eingabe == null) {
                return
            }
            
            if (this.aufgabe.eingabe == this.ergebnis) {
                this.aufgabe.pruefung = "richtig!"
                this.inputClass = "correct"
                this.disabled = true
            } else {
                this.aufgabe.pruefung = ""
                this.inputClass = "wrong"
                this.disabled = true
            }
            currentTime = this.$root.$data.timer
            this.duration = currentTime - this.$root.$data.lastOperation
            this.$root.$data.lastOperation = currentTime
        }
    },
    watch: {
        'aufgabe.eingabe': function(value, previous) {
            if (value != previous) {
                this.inputClass = "",
                this.disabled = false,
                this.duration = null
            }
        }
    },
    template: `
        <div class="table-row">
            <div class="table-cell">{{ aufgabe.x }}</div>
            <div class="table-cell">&nbsp;{{ aufgabe.operator }}&nbsp;</div>
            <div class="table-cell">{{ aufgabe.y }}</div>
            <div class="table-cell">&nbsp;=&nbsp;</div>
            <div class="table-cell"><input :class="inputClass" type="number" min="0" max="100" inputmode="numeric" pattern="[0-9]*" v-model="aufgabe.eingabe" :disabled="disabled"></div>
            <div class="table-cell"><button @click="pruefe">OK</button></div>
            <div class="table-cell">{{ durationText }}</div> 
        </div>`
})

var data = {
    aufgabeList: [],
    timerInterval: null,
    timer: 0,
    lastOperation: 0
}

var app = new Vue({
    el: '#app',
    data: data, 
    methods: {
        UebergangPlus: UebergangPlus,
        UebergangMinus: UebergangMinus,
        UebergangMultiplizieren: UebergangMultiplizieren,
        UebergangDividieren: UebergangDividieren,
        startTimer: function() {
            this.timer = 0
            clearInterval(this.timerInterval)
            this.timerInterval = setInterval(() => (this.timer += 1), 1000);
        },  
        stopTimer: function() {
            this.timer = 0
            clearInterval(this.timerInterval)
        }
    }
})
