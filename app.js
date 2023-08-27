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

UebergangMinus1000 = () => {
    app.reset()
    var aufgabenStringList = []

    xMax = 999
    yMax = 800
    operator = '-', 
    condition = (aufgabe) => {
        return aufgabe.x > aufgabe.y &&
                aufgabe.x >= 300 && aufgabe.y > 150 &&
                (aufgabe.x - aufgabe.y) > 70
    }

    for(i = 0; i < 7; i++) {    
        var x, y;
        var conditionsMet = false
        do {
            x = Math.floor(Math.random() * xMax) + 1;
            y = Math.floor(Math.random() * yMax) + 1;
            
            xs = x.toString()
            ys = y.toString()

            aufgabe = {
                id: i, operator: operator, 
                x: x, xarr: [xs.at(0), xs.at(1), xs.at(2)], 
                y: y, yarr: [ys.at(0), ys.at(1), ys.at(2)]
            }

            s = aufgabeToString(aufgabe)
            aufgabeDoesntExist = aufgabenStringList.indexOf(s) == -1

            if (aufgabeDoesntExist && condition(aufgabe)) {
                aufgabenStringList.push(s)
                conditionsMet = true

                data.aufgabeMinus1000List.push(aufgabe)
            }
        } while (!conditionsMet)
    }

    app.startTimer()
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
    app.reset()
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

watch = function(value, previous) {
    if (value != previous) {
        this.inputClass = "",
        this.disabled = false,
        this.duration = null
    }
}

AufgabeMixin = {
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
            this.$root.$data.itemsSubmitted++
        }
    },
    watch: {
        'aufgabe.eingabe': watch,
        'aufgabe.eingabe1': watch,
        'aufgabe.eingabe2': watch,
        'aufgabe.eingabe3': watch
    },
}

Vue.component('aufgabe-item', {
    mixins: [AufgabeMixin],
    template: `
<div class="table-row">
    <div class="table-cell">{{ aufgabe.x }}</div>
    <div class="table-cell">&nbsp;{{ aufgabe.operator }}&nbsp;</div>
    <div class="table-cell">{{ aufgabe.y }}</div>
    <div class="table-cell">&nbsp;=&nbsp;</div>
    <div class="table-cell"><input :class="inputClass" type="number" min="0" max="100" autofocus
        inputmode="numeric" pattern="[0-9]*" v-model="aufgabe.eingabe" :disabled="disabled" 
        @keyup.enter="pruefe" ></div>
    <div class="table-cell"><button @click="pruefe" :disabled="disabled">OK</button></div>
    <div class="table-cell">{{ durationText }}</div> 
</div>`
})

Vue.component('aufgabe-minus1000-item', {
    mixins: [AufgabeMixin],
    methods: {
        pruefe: function() {
            if (isNaN(this.aufgabe.eingabe1)) {
                this.aufgabe.eingabe1 = "0"
            }
            if (isNaN(this.aufgabe.eingabe2)) {
                this.aufgabe.eingabe2 = "0"
            }
            if (isNaN(this.aufgabe.eingabe3)) {
                return
            }

            eingabe = parseInt(this.aufgabe.eingabe3) + parseInt(this.aufgabe.eingabe2) * 10 + parseInt(this.aufgabe.eingabe1) * 100

            if (eingabe == this.ergebnis) {
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
            this.$root.$data.itemsSubmitted++
        }
    },
    template: `
<div>
    <div class="table-row">
        <div class="table-cell center"></div>
        <div class="table-cell center">{{ aufgabe.xarr[0] }}</div>
        <div class="table-cell center">{{ aufgabe.xarr[1] }}</div>
        <div class="table-cell center">{{ aufgabe.xarr[2] }}</div>
    </div>
    <div class="table-row">
        <div class="table-cell center">-</div>
        <div class="table-cell center">{{ aufgabe.yarr[0] }}</div>
        <div class="table-cell center">{{ aufgabe.yarr[1] }}</div>
        <div class="table-cell center">{{ aufgabe.yarr[2] }}</div>
    </div>
    <div class="table-row">
        <div class="table-cell center"></div>
        <div class="table-cell center"><input :class="inputClass" type="number" min="0" max="9" autofocus
            inputmode="numeric" pattern="[0-9]*"></div>
        <div class="table-cell center"><input :class="inputClass" type="number" min="0" max="9" autofocus
            inputmode="numeric" pattern="[0-9]*"></div>
    </div>
    <div class="table-row">
        <div class="table-cell">=</div>
        <div class="table-cell"><input :class="inputClass" type="number" min="0" max="9" autofocus
            inputmode="numeric" pattern="[0-9]*" v-model="aufgabe.eingabe1" :disabled="disabled"></div>
        <div class="table-cell"><input :class="inputClass" type="number" min="0" max="9" autofocus
            inputmode="numeric" pattern="[0-9]*" v-model="aufgabe.eingabe2" :disabled="disabled"></div>
        <div class="table-cell"><input :class="inputClass" type="number" min="0" max="9" autofocus
            inputmode="numeric" pattern="[0-9]*" v-model="aufgabe.eingabe3" :disabled="disabled"></div>
        <div class="table-cell"><button @click="pruefe" :disabled="disabled">OK</button></div>
        <div class="table-cell">{{ durationText }}</div> 
    </div>
</div>`
})

var data = {
    aufgabeList: [],
    aufgabeMinus1000List: [],
    itemsSubmitted: 0,
    timerInterval: null,
    timer: 0,
    lastOperation: 0
}

var app = new Vue({
    el: '#app',
    data: data,
    watch: {
        itemsSubmitted: function(value) {
            if (value == this.aufgabeList.length || value == this.aufgabeMinus1000List.length) {
                this.stopTimer()
            }
        }
    },
    methods: {
        reset: function() {
            this.lastOperation = 0
            this.aufgabeList = []
            this.aufgabeMinus1000List = []
            this.itemsSubmitted = 0
        },
        UebergangPlus: UebergangPlus,
        UebergangMinus: UebergangMinus,
        UebergangMinus1000: UebergangMinus1000,
        UebergangMultiplizieren: UebergangMultiplizieren,
        UebergangDividieren: UebergangDividieren,
        startTimer: function() {
            this.stopTimer()
            this.timer = 0
            this.lastOperation = 0
            this.timerInterval = setInterval(() => (this.timer += 1), 1000);
        },  
        stopTimer: function() {
            clearInterval(this.timerInterval)
            this.timerInterval = null
        }
    }
})
