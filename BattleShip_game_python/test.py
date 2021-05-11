import random
import turtle
import math

CELLSIZE = 50

ship_pos=[]

def grid(size):

    ocean_grid=[]

    for i in range(size+1):
        for j in range(size):
            ocean_grid.append([(i+1,j+1),""])
    print(ocean_grid)


def star(size, color):
    angle = 120
    turtle.fillcolor(color)
    turtle.begin_fill()

    for side in range(5):
        turtle.forward(size)
        turtle.right(angle)
        turtle.forward(size)
        turtle.right(72 - angle)
    turtle.end_fill()
 

def gen_ran():

    position=(random.randint(1,10),random.randint(1,10))
    dirc=random.randint(1,2) #1 is vertical
        
    return position,dirc


def user_output(score, filename):

    name=''
    while bool(name.strip())==False:
        name=input("Thanks for playing! Please enter your name: ").replace(" ","")

    try:
        file=open(filename,'r')
    
    except FileNotFoundError as error:
        file=open(filename,'w')
        file=open(filename,'r')

    mylist=[]
    
    for line in file:
        print(line)
        if bool(line.strip())==True:
            mylist.append((line.strip()).split(' '))

    original_size=len(mylist)
    for i in range(original_size):
        print(i, original_size, mylist)
        if score<int(mylist[i][1]) and original_size==len(mylist):
            mylist.insert(i,[name, score])
        elif i==original_size-1 and original_size==len(mylist):
            mylist.append([name, score])

    file=open(filename,'w')
    for record in mylist:
        file.write(record[0]+" "+str(record[1]) +"\n")

    file.close()  

    print(mylist)


def main():

    #mylist=[["carrier",5,[]],["battleship",4,[]], ["cruiser",3,[]], ["submarine",3,[]],["destroyer",2,[]]]
    #mark_ships(mylist)

    user_output(2,"scores.txt")

    #star(5, "red")


main()
