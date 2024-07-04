// sistema de coordenadas
let [xa, xb] = [v(-6,0,0), v(6,0,0)]
let [ya, yb] = [v(0,-6,0), v(0,6,0)]
let [za, zb] = [v(0,0,-6), v(0,0,6)]
draw.line(xa, xb, "#ff0000")
draw.line(ya, yb, "#00ff00")
draw.line(za, zb, "#0000ff")

let Rs = 600, Rl = 1.7, Rt = 6
let Ds = 150000, Dt = 384

draw.sphere(v(-Ds, 0, 0), Rs, "yellow") //sol
draw.sphere(v(0, 0, 0), Rl, "gray") // lua
draw.sphere(v(Dt, 0, 0), Rt, "blue") // terra

let tgu = (Rs-Rl)/Ds // inclinacao da reta tangente ao sol e a lua (cone da umbra)
let Dvu = Rl/tgu // distancia vertice umbra
let Dccu = (Dvu - Ds)/2 // distancia centro cone umbra
let Acu = Ds + Dvu // Altura do cone da umbra

let tgp = (Rs + Rl)/Ds // inclinacao da reta tangente ao sol e a lua (cone da penumbra)
let Dvp = Rl/tgp // distancia vertice penumbra
let Dccp = (-Dvp + Dt)/2 // distancia centro cone penumbra
let Acp = Dt + Dvp // Altura do cone da penumbra
let Rcp = (Dvp + Dt) * tgp // raio do cone da penumbra

draw.cylinder(v(Dccu,0,0), v(1,0,0), Rs, 0, Acu, "yellow", .5) // umbra da lua correta
draw.cylinder(v(Dccu,0,0), v(1,0,0), Rl, Rl, Acu, "red", .5) // umbra da lua do bruno
draw.cylinder(v(Dccp,0,0), v(1,0,0), 0, Rcp, Acp, "green", .5) // penumbra da lua correta

draw.camera(v(1,0,15), v(0,0,0))