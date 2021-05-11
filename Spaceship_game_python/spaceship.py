

'''

    Aida Sharif Rohani
    HW 5
    
'''


import turtle
import random

#I defined word and shape global so all drawing functions can share them
word=turtle.Turtle()
ship=turtle.Turtle()

#depending on number of chances remaind determines which part to draw
def draw_parts(chances):

    if chances==5:
        draw_body()
    elif chances==4:
        draw_rocket("left")
    elif chances==3:
        draw_rocket("right")
    elif chances==2:
        draw_flame("left")
    elif chances==1:
        draw_flame("right")
    

#each time this function gets a single character guess from user
def user_guess(target):
    
    positions=[]
    guess=''

    while bool(guess.strip())==False or len(guess)>1:
        try:
            guess=input("Please insert a single characted as your guess: ")
        except Exception as error:
            print('Something went wrong, please try again', error)
            
    
    for i in range(len(target)):
        if target[i]==guess:
            positions.append(i)
            
    return guess, positions


#when user wants to exit it gets the name and writes the score on file
#if the file does not exit it makes a new one
def user_output(score):

    name=''
    while bool(name.strip())==False:
        name=input("Thanks for playing! Please enter your name: ")

    try:
        file=open("scores.txt",'r')
    
    except FileNotFoundError as error:
        file=open("scores.txt",'w')
        file=open("scores.txt",'r')

    mylist=[]
    for line in file: 
        mylist.append((line.strip()).split(' '))

    maxx=get_max(mylist,score)
    new_record=name+' '+str(score)+'\n'
    
    if score==maxx:
        
        file=open("scores.txt",'r+')
        file.truncate(0)
        file=open("scores.txt",'w')
        file.write(new_record)
        
        for i in range(len(mylist)):
            file.write(mylist[i][0])
            file.write(' ')
            file.write(mylist[i][1])
            file.write('\n')

    else:
        file=open("scores.txt",'a')
        file.write(new_record)
        
    file.close()


#from a list of names and scores gets the max score 
def get_max(mylist, score):

    for i in range(len(mylist)):
        if score>int(mylist[i][1]):
            maxx=score
    else:
        maxx=int(mylist[i][1])

    return maxx

#from a current dictionary file randomly selects a word by random method
def get_word():

    file=open("wordlist.txt",'r')
    count=0
    wordlist=[]
    
    for line in file:
        target=line.strip().lower()
        wordlist.append(target)
        count+=1
        
    file.close()   
    return wordlist[random.randint(0,(len(wordlist)-1))]


#writes the wrong guess in empty positions
def write_inblank(guess, positions):

    word.hideturtle()
    word.ht()
    blankLength=40
    startx=-320
    starty=-190

    for i in positions:
        word.penup()
        word.goto(startx+i*blankLength,starty)
        word.pendown()
        word.write (guess, font = ('Times New Roman', 20, 'bold'))

 #writes the right guess in empty positions
def write_char(guess, guessed):
    
    word.hideturtle()
    word.ht()
    blankLength=40
    startx=-310
    starty=300

    word.penup()
    word.goto(startx+len(guessed)*blankLength,starty)
    word.pendown()
    word.write (guess, font = ('Times New Roman', 20, 'bold'))

#based on number of target word characters draws empty spaces
def draw_blank(word_length):

    word.hideturtle()
    word.ht()
    blankLength=30
    startx=-320
    starty=-200

    for i in range(word_length):
        word.penup()
        word.goto(startx,starty)
        word.pendown()
        word.goto(blankLength+startx,starty)
        startx=startx+blankLength+10


def draw_rocket(side):

    ship.hideturtle()
    ship.ht()

    if side=="left":
        a=1
        b=0
    else:
        a=-1
        b=-105

    ship.fillcolor("black")
    ship.begin_fill()
    ship.penup()
    ship.goto(-90*a+b,0)
    ship.pendown()
    ship.goto(-60*a+b,-70)
    ship.goto(-120*a+b,-70)
    ship.goto(-90*a+b,0)
    ship.end_fill()

def draw_flame(side):

    ship.hideturtle()
    ship.ht()

    color=['red','orange','yellow']

    if side=="left":
        a=1
        b=0
    else:
        a=-1
        b=-105

    for i in range(7):
        ship.fillcolor(color[i%3])
        ship.begin_fill()
        ship.penup()
        ship.goto(-90*a+b,-75)
        ship.pendown()
        ship.left(50)
        
        r=10
        
        for loop in range(2):      
            ship.circle(r,90)    
            ship.circle(r/2,90)
            
        ship.end_fill()
    
    
def draw_body():

    ship.hideturtle()
    ship.ht()  
    ship.fillcolor("blue")
    ship.begin_fill()
    ship.penup()
    ship.goto(0,0)
    ship.pendown()
    ship.left(45)
    
    r=150
    
    for loop in range(2):
        
        ship.circle(r,90)    
        ship.circle(r/2,90)
        
    ship.end_fill()

    ship.fillcolor("Light Sky Blue")
    ship.begin_fill()
    ship.penup()
    ship.goto(-30,150)
    ship.pendown()
    ship.circle(30)
    ship.end_fill()

    ship.fillcolor("White")
    ship.begin_fill()
    ship.penup()
    ship.goto(-38,100)
    ship.pendown()
    ship.circle(20)
    ship.end_fill()

def clear_page():

    word.reset()
    ship.reset()

