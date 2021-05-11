
'''

    HW6 Aida Sharif Rohani

    ---------------------------------------------------------------------
    Test 1, file "maze1.txt"

    1 2 0 0 0 1
    +-+-+
    | | |
    +-+-+

    Sorry no solution found for this maze!
    ---------------------------------------------------------------------
    Test 2, file "maze2.txt"

    2 3 0 0 1 0
    +-+-+-+
    |     |
    + +-+ +
    |     |
    +-+-+-+

    Here is your path from:(0, 0) to:(1, 0)
    
     [(0, 0), (0, 1), (0, 2), (1, 2), (1, 1), (1, 0)]
    ---------------------------------------------------------------------
    Test 3, file "maze3.txt"
    
        5 11 0 0 4 10
    +-+-+-+-+-+-+-+-+-+-+-+
    |             |       |
    +-+-+-+-+-+ +-+ +-+-+ +
    |                     |
    +-+-+-+-+-+-+-+-+-+ +-+
    |                     |
    +-+ +-+-+-+-+-+-+-+-+-+
    |                     |
    +-+-+ +-+-+-+-+-+-+-+-+
    |                     |
    +-+-+-+-+-+-+-+-+-+-+-+

    Here is your path from:(0, 0) to:(4, 10)
    
     [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (0, 5),(1, 5), (1, 6),
     (1, 7), (1, 8), (1, 9), (2, 9),(2, 8), (2, 7), (2, 6), (2, 5),
     (2, 4), (2, 3), (2, 2), (2, 1),(3, 1), (3, 2), (4, 2), (4, 3),
     (4, 4), (4, 5),(4, 6), (4, 7), (4, 8), (4, 9), (4, 10)]
    ---------------------------------------------------------------------
     Test 4, file "maze4.txt"

     2 7 0 0 1 6
    +-+-+-+-+-+-+-+
    |     |       |
    + +-+ +-+-+-+-+
    |             | 
    +-+-+-+-+-+-+-+

    Here is your path from:(0, 0) to:(1, 6)
    
     [(0, 0), (0, 1), (0, 2), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6)]
    ---------------------------------------------------------------------
    Test 5, file "maze5.txt"

    3 6 0 0 2 3
    +-+-+-+-+-+-+
    |     |     |
    + +-+-+ +-+ +
    |           |
    +-+-+-+-+-+-+
    |           |
    +-+-+-+-+-+-+
    
    Sorry no solution found for this maze!

    ---------------------------------------------------------------------
    Test 6, file "maze6.txt"   *(there is no square (0,7))
    
    1 7 0 3 0 7
    +-+-+-+-+-+-+-+
    | |           |       
    +-+-+-+-+-+-+-+

    Sorry no solution found for this maze!

    ---------------------------------------------------------------------
    Test 7, file "maze6.txt"   
    
    1 7 0 3 0 3
    +-+-+-+-+-+-+-+
    | |           |       
    +-+-+-+-+-+-+-+

    Sorry no solution found for this maze!
    The start and end point should not be the same.

'''
#imports maze class
import Maze

path=[] #creates an empty list to add all the visited squares so far

#the recursive function whith a maze object as an argumet
def solve_maze(maze1):  

    end=maze1.getEnd()
    #for the last item on the path gets all possible directions it can move to
    #openDirs receive the last tuple on the path list
    directions=maze1.openDirs(path[-1])

    #in a for loop for all possible directions moves to next square if that square is
    #is unexplored or returns to previous one if all directions are explored
    for i in directions:

        #first checks if next item on R is not explored
        if i=='R' and (path[-1][0],path[-1][1]+1) not in path:
            #if not explored add it to the last item on path
            path.append((path[-1][0],path[-1][1]+1))
            #for last item recurses to find new directions
            solve_maze(maze1)
            #when recursion returns these lines execute, there are 2 possibilities:
            #1- last item is found in which case returns and path remains with right squares
            if end==path[-1]:
                return
            #2- last item could not go any further from all directions and in this case
            #last item is removed
            else:
                path.pop(-1)

        #the following directions have the same structure as previous block
        elif i=='L'and (path[-1][0],path[-1][1]-1) not in path:
            path.append((path[-1][0],path[-1][1]-1))
            solve_maze(maze1)
            if end==path[-1]:
                return
            else:
                path.pop(-1)
            
        elif i=='U' and (path[-1][0]-1,path[-1][1]) not in path:
            path.append((path[-1][0]-1,path[-1][1]))
            solve_maze(maze1)
            if end==path[-1]:
                return
            else:
                path.pop(-1)
            
        elif i=='D' and (path[-1][0]+1,path[-1][1]) not in path:
            path.append((path[-1][0]+1,path[-1][1]))
            solve_maze(maze1)
            if end==path[-1]:
                return
            else:
                path.pop(-1)


def main():

    #using try/except block for no file error or any other related errors
    try:
        #creates a maze object from maze class
        maze1=Maze.Maze("maze6.txt")
        start=maze1.getStart()
        #the first item on path is the start point
        path.append(start)
        end=maze1.getEnd()
        #recursion starts from here
        solve_maze(maze1)

        #checks to see if the path length is zero or 1 it means there was no solutuon
        #or the start and end point were the same
        if len(path)<2:
            print("Sorry no solution found for this maze!")
        elif len(path)==1 and end==start:
            print("The start and end point should not be the same.")
        else:
            print("Here is your path from:", start, "\tto:", end, "\n", path, sep="")
        
    except FileNotFoundError as error:
        print(error)

    except Exception as error:
        print("Sorry, something went wrong.", error)


main()
