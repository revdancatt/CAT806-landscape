int tempHue;

void setup() 
{
    size(control.width, control.height, OPENGL);  // Size should be the first statement
    frameRate(24);
    control.makegrid();
    colorMode(HSB, 100);
}

void draw() 
{
  
  if (control.pause == false) {

    background(0);   // Set the background to black
    
    //  Draw all the horizontal log lines and vertical day lines
    stroke(0);
    strokeWeight(1);

    translate(width/2, height/2);

    //
    control.movegrid();


    //  horizontal line
    rotateX(radians(55));
    //rotateY(sin(radians(control.deg))*0.33);
    translate(0, -height * 0.92, 0);

    for (int y = 0; y <= control.maxY-1; y++) {
        for (int x = 0; x <= control.maxX-1; x++) {

            tempHue = control.hue - y;
            if (tempHue < 1) tempHue = tempHue + 100;

            fill(tempHue, 100, ((y+1)*(100/control.maxY)));

            beginShape(TRIANGLES);
            vertex((x-(control.maxX/2)+0)*width*0.0625, (y+0)*height*0.0833, control.grid[y+0][x+0]);
            vertex((x-(control.maxX/2)+1)*width*0.0625, (y+0)*height*0.0833, control.grid[y+0][x+1]);
            vertex((x-(control.maxX/2)+0)*width*0.0625, (y+1)*height*0.0833, control.grid[y+1][x+0]);
            endShape();

            beginShape(TRIANGLES);
            vertex((x-(control.maxX/2)+1)*width*0.0625, (y+0)*height*0.0833, control.grid[y+0][x+1]);
            vertex((x-(control.maxX/2)+1)*width*0.0625, (y+1)*height*0.0833, control.grid[y+1][x+1]);
            vertex((x-(control.maxX/2)+0)*width*0.0625, (y+1)*height*0.0833, control.grid[y+1][x+0]);
            endShape();

        }

        blur();

    }


    control.deg++;
    control.hue++;
    if (control.hue > 100) control.hue = 1;

  }

}

void blur() {
    loadPixels();
}
