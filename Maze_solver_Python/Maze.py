class Maze:
    def __init__(self, fname):
        self.read_maze_file(fname)
    
    def read_maze_file(self, fname):
        try:
            fd = open(fname, "r")
            linenum = 1
            vals = [int(x) for x in fd.readline().split()]
            self.dims = (vals[0], vals[1])
            self.start = (vals[2], vals[3])
            self.end = (vals[4], vals[5])
            linenum += 1
            fd.readline()    # discard top wall
            self.right_walls = []
            self.bottom_walls = []
            for r in range(self.dims[0]):
                # process side walls
                self.right_walls.append([])
                linenum += 1
                s = fd.readline()[2::2]
                for c in range(self.dims[1]):
                    self.right_walls[r].append(s[c] == '|')
                # process bottom walls
                self.bottom_walls.append([])
                linenum += 1
                s = fd.readline()[1::2]
                for c in range(self.dims[1]):
                    self.bottom_walls[r].append(s[c] == '-')
        except FileNotFoundError as err:
            raise  # re-raise exception
        except Exception as err:
            print("Processing line", linenum, "raised exception:", err)
            raise  # re-raise exception
    
    def getSize(self):
        return self.dims
    
    def getStart(self):
        return self.start
    
    def getEnd(self):
        return self.end
    
    def openDirs(self,row_col_pair):

        rc=row_col_pair

        #[[False, False, True], [False, False, True]] right example
        #[[True, True, False], [True, True, True]]  down example

        self.directions=[]
        #for each list of walls checks if there is or there is not a wall(True)
        #if the right wall list is False for that tuple it means it can move in
        #that direction, if True that direction is not included in direction list
        if self.right_walls[rc[0]][rc[1]]==False:
            self.directions.append("R")
        if ((rc[1])-1)>=0 and self.right_walls[rc[0]][(rc[1])-1]==False:
            self.directions.append("L")
        if self.bottom_walls[rc[0]][rc[1]]==False:
           self.directions.append("D")
        if ((rc[0])-1)>=0 and self.bottom_walls[(rc[0])-1][rc[1]]==False:
           self.directions.append("U")

        return self.directions
