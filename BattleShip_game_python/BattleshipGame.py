import turtle
import math
import random

#constant
LENGTH=30

class BattleshipGame:
    
    def __init__(self, filename, size=10):
        self.filename=filename
        #put all the ships with their size in a list
        self.ship_list=[["Carrier",5],["Battleship",4], ["Cruiser",3], ["Submarine",3],["Destroyer",2]]
        #counts guesses
        self.guess=0
        self.start=(-200,200)
        self.size=size
        self.ocean_grid={}
        #keeps track of the number of guesses the user has made.
        self.target_grid=[]
        #placing the ships in random positions and orientations.
        self.mark_ships(self.ship_list)
        #creates the graphical display.
        self.board()
        self.word=turtle.Turtle()
        self.word.ht()
        
    #generates random x, y and direction positions
    def gen_ran(self):
    
        position=(random.randint(1,self.size),random.randint(1,self.size))
        dirc=random.randint(1,2) #1 is vertical
        
        return position,dirc
    #checks if for a specific size of a ship and direction there is avalable room on board
    #return true if there is and false if there is not so another number is generated
    def check_space(self,position,dirc, size):

        space=True
        temp=position

        for i in range(size):
            if temp in self.ocean_grid or temp[0]>self.size or  temp[1]>self.size or temp[0]<1 or temp[1]<1:
                return False
            else:
                if dirc==1:
                    temp=(temp[0],temp[1]+1)
                elif dirc==2:
                    temp=(temp[0]+1,temp[1])
                        
        return True

    #marks the ship positions in a dictionary, each ship can be found
    #by its key which is a position
    def mark_ships(self,ship_list):
        
        for ship in self.ship_list:
            space=False
            while space==False:
                pos,dirc=self.gen_ran()
                space=self.check_space(pos,dirc, ship[1])

            size=ship[1]
            for i in range(size):
                d={pos:[ship[0], "NG", size]}
                self.ocean_grid.update(d)
                if dirc==1:
                    pos=(pos[0],pos[1]+1)
                elif dirc==2:
                    pos=(pos[0]+1,pos[1])

        
        #print(self.ocean_grid)

    # presents a graphical board for the targeting grid board.
    def board(self):
        self.write_once(self.ship_list)
        br=turtle.Turtle()
        br.speed(2000)
        br.ht()
        br.penup()
        br.goto(self.start)
        br.fillcolor("dark blue")
        br.begin_fill()
        br.goto(self.start)
        br.pendown()

        for i in range(4):
            br.fd(LENGTH*self.size)
            br.rt(90)
        br.end_fill()

        #horizantal lines
        for i in range(self.size):
            current=br.pos()
            br.pendown()
            br.goto(current[0]+LENGTH*self.size,current[1])
            br.penup()
            br.goto(current[0],current[1]-LENGTH)

        br.goto(self.start)
        
        #vertical lines
        for i in range(self.size):
            current=br.pos()
            br.pendown()
            br.goto(current[0],current[1]-LENGTH*self.size)
            br.penup()
            br.goto(current[0]+LENGTH,current[1])

    #writes the name of ships on graphic board
    def write_once(self,list1):
        myString=""
        for i in list1:
            myString+=i[0]+": "+str(i[1])+"   "
        w=turtle.Turtle()
        w.speed(2000)
        w.ht()
        w.penup()
        w.goto(-300,260)
        w.pendown()
        w.write (myString, font = ('Times New Roman', 20, 'bold'))

    #updates the game messages on the board
    def write(self,sentence):
        self.word.penup()
        self.word.speed(2000)
        self.word.ht()
        self.word.clear()
        self.word.goto(-200,230)
        self.word.pendown()
        self.word.write (sentence, font = ('Times New Roman', 20, 'bold'))
        self.word.penup()
    #marks blue circle 
    def mark(self,x,y):
        
        cl=turtle.Turtle()
        cl.ht()
        cl.speed(2000)
        cl.penup()
        x1=self.start[0]+(y-1)*30
        y1=self.start[1]-(x-1)*30
        cl.goto(x1+LENGTH/2,y1-LENGTH)

        cl.fillcolor("blue")
        cl.begin_fill()
        cl.pendown()
        cl.circle(15)
        cl.end_fill()

    #marks red star 
    def st(self,x,y):

        st=turtle.Turtle()
        st.ht()
        st.speed(2000)
        st.penup()
        x1=self.start[0]+(y-1)*30+5
        y1=self.start[1]-(x-1)*30+22
        st.goto(x1+LENGTH/2,y1-LENGTH)
        
        angle = 120
        size=10
        st.fillcolor("red")
        st.begin_fill()
        st.pendown()

        for side in range(5):
            st.forward(size)
            st.right(angle)
            st.forward(size)
            st.right(72 - angle)
        st.end_fill()
 
    #registers the object's do_one_move() method as the screen click handler.
    def play_game(self):
        #activates the screen click and send position to one move to handle it
        turtle.onscreenclick(self.do_one_move)

    def convert(self, x,y):
        #converts board positions to 
        x1=math.ceil((self.start[1]-y)/LENGTH)
        y1=math.ceil((x-self.start[0])/LENGTH)
	
        return x1,y1

     #handles one click per call. It checks the validity of the clicks,
     #and execute the move if it is on a legitimate board square.
    def do_one_move(self,x,y):
        game=True
        #deactivates screen click
        turtle.onscreenclick(None)
        x,y=self.convert(x,y)
        num=0
        
        if (x,y) in self.target_grid or x>10 or y>10 or x<1 or y<1:
            self.play_game()

        #If the click is valid, do_one_move() will change the grid square to indicate whether
        #it's a hit or miss by drawing a red star or a blue circle
        else:
            #keep track of the number of guesses the user has made.
            self.target_grid.append((x,y))
            self.guess+=1
            if (x,y) in self.ocean_grid:
                self.ocean_grid[(x,y)][1]="G"
                self.st(x,y)
                print("You hit a", self.ocean_grid[(x,y)][0].lower())
                self.write("You hit a "+ self.ocean_grid[(x,y)][0].lower())

                whole=0
                for s in self.ocean_grid:
                    #checks if the position is already in ocean grid where only ships are marked
                    #if yes it changes the NG to G to mark it as guesses
                    if self.ocean_grid[s][0]==self.ocean_grid[(x,y)][0]:
                        if self.ocean_grid[s][1]=="G":
                            whole+=1
                #if all the NG are turned to G for a specific ship the ship us marked as sunk
                if whole==self.ocean_grid[(x,y)][2]:
                    print("You sunk a ", self.ocean_grid[(x,y)][0].lower())
                    self.write("You sunk a " +self.ocean_grid[(x,y)][0].lower())
                    
                    
            else:
                #if not in ocean grid then it's a loss
                print("It was a loss!")
                self.write("It was a loss!")
                self.mark(x,y)

        #checks if all the ships in ocean grid are guessed if not it calls play again
        for s in self.ocean_grid:
            if self.ocean_grid[s][1]=="NG":
                self.play_game()
            elif self.ocean_grid[s][1]=="G":
                num+=1

        #detect when the game is over
        if num==len(self.ocean_grid):
            self.write("Thanks for playing! Your score is: " + str(self.guess))
            print("Your score is: ", self.guess)
            #print("ocean grid:", self.ocean_grid, "\n")
            #print("Target grid:", self.target_grid, "\n")
            self.user_output(self.guess)
        
    #When the game is over (all ships sunk) it writes out the score file
    def user_output(self, score):

        name=''
        #if the name is empty it asks the user again
        while bool(name.strip())==False:
            name=input("Thanks for playing! Please enter your name: ").replace(' ', '')

        try:
            file=open(self.filename,'r')
        
        except FileNotFoundError as error:
            file=open(self.filename,'w')
            file=open(self.filename,'r')

        mylist=[]
        for line in file:
            if bool(line.strip())==True:
                mylist.append((line.strip()).split(' '))
        #checks if the new score is smaller than the other scores in the file
        original_size=len(mylist)
        for i in range(original_size):
            if score<int(mylist[i][1]) and original_size==len(mylist):
                mylist.insert(i,[name, score])
            elif i==original_size-1 and original_size==len(mylist):
                mylist.append([name, score])
        #writes back the updated scores and names in the file
        file=open(self.filename,'w')
        for record in mylist:
            file.write(record[0]+" "+str(record[1]) +"\n")
        print("Thanks, bye!")
        file.close()  

def main():

    bs_game=BattleshipGame("scores.txt",10)
    #start the actual game play by calling bs_game.play_game()
    bs_game.play_game()
    

main()
