
import Maze


def solve_maze(maze1, path, final): 

    end=maze1.getEnd()
    directions=maze1.openDirs(path[-1])

    for i in directions:

        if i=='R' and (path[-1][0],path[-1][1]+1) not in path:
            temp=(path[-1][0],path[-1][1]+1)
            path.append((path[-1][0],path[-1][1]+1))
            solve_maze(maze1,path, final)
            if end==path[-1]:
                final.append(temp)
                return final
            else:
                path.pop(-1)

        elif i=='L'and (path[-1][0],path[-1][1]-1) not in path:
            temp=(path[-1][0],path[-1][1]-1)
            path.append((path[-1][0],path[-1][1]-1))
            solve_maze(maze1,path, final)
            if end==path[-1]:
                final.append(temp)
                return final
            else:
                path.pop(-1)
            
        elif i=='U' and (path[-1][0]-1,path[-1][1]) not in path:
            temp=(path[-1][0]-1,path[-1][1])
            path.append((path[-1][0]-1,path[-1][1]))
            solve_maze(maze1,path, final)
            if end==path[-1]:
                final.append(temp)
                return final
            else:
                path.pop(-1)
            
        elif i=='D' and (path[-1][0]+1,path[-1][1]) not in path:
            temp=(path[-1][0]+1,path[-1][1])
            path.append((path[-1][0]+1,path[-1][1]))
            solve_maze(maze1,path, final)
            if end==path[-1]:
                final.append(temp)
                return final
            else:
                path.pop(-1)
                 

def main():

    maze1=Maze.Maze("maze4.txt")
    start=maze1.getStart()
    path=[]
    final=[]
    path.append(start)
    end=maze1.getEnd()
    finall=[]
    finall=solve_maze(maze1,path, final)

    if finall is None or len(finall)<2:
        print("Sorry no solution found for this maze!")
    elif len(finall)==1 and end==start:
        print("The start and end point should not be the same.")
    else:
        finall.reverse()
        final.insert(0,start)
        print("Here is your path from:", start, "\tto:", end, "\n", finall, sep="")


main()
