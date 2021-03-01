function connectToDrone () {
    response = "NaN"
    drone_online = false
    busy = true
    serial.writeString("command")
    while (busy) {
        basic.pause(10)
    }
    if (response.compare("ok") == 0) {
        drone_online = true
        basic.showIcon(IconNames.Heart)
    }
}
function InstructTello (instruction: string) {
    while (!(drone_online)) {
        basic.pause(10)
    }
    while (busy) {
        basic.pause(100)
    }
    busy = true
    response = "NaN"
    serial.writeString(instruction)
}
input.onButtonPressed(Button.A, function () {
    connectToDrone()
    InstructTello("takeoff")
    flying = true
})
serial.onDataReceived(serial.delimiters(Delimiters.Colon), function () {
    response = serial.readUntil(serial.delimiters(Delimiters.Colon))
    busy = false
})
function initialize () {
    serial.redirect(
    SerialPin.P0,
    SerialPin.P1,
    BaudRate.BaudRate115200
    )
    basic.showIcon(IconNames.SmallHeart)
    drone_online = false
    busy = false
    roll = 0
    yaw = 0
    pitch = 0
    throttle = 0
}
function rc (roll: number, pitch: number, throttle: number, yaw: number) {
    while (!(drone_online)) {
        basic.pause(10)
    }
    serial.writeString("rc" + " " + roll + " " + pitch + " " + throttle + " " + yaw)
}
input.onButtonPressed(Button.AB, function () {
    InstructTello("land")
})
let throttle = 0
let pitch = 0
let yaw = 0
let roll = 0
let flying = false
let busy = false
let drone_online = false
let response = ""
initialize()
basic.forever(function () {
    if (flying) {
        if (input.buttonIsPressed(Button.B)) {
            yaw = 0
            throttle = 0
        } else {
            if (input.buttonIsPressed(Button.A)) {
                throttle = 0
                yaw = 0
            } else {
                throttle = 0
                roll = 0
                pitch = 0
            }
        }
        rc(roll, pitch, throttle, yaw)
    }
    basic.pause(500)
})
