
'''

    Aida Sharif Rohani
    HW 5
    
    Driver function manages different files in spaceship module
'''


from spaceship import *


def main():
    score=0
    answer='y'

    #this is  an interactive function as long as user did not enter any
    #word except Y it continues playing game
    while answer=="y":
        target=get_word()
        draw_blank(len(target))
        guessed=[]
        chances=5
        current_word=[0]*len(target)

        #checks to see if still chances are left and if the word is
        #not complete yet asks the user to insert another guess
        while chances>0 and current_word!=list(target):
            guess, positions=user_guess(target)
            
            if len(positions)>0 and not(guess in current_word):
                write_inblank(guess, positions)
                for i in positions:
                    current_word[i]=guess
            else:
                draw_parts(chances)
                write_char(guess, guessed)
                chances-=1
                guessed.append(guess)
            
            guess=''
            positions=[]

        if current_word==list(target):
            point=1
        else:
            point=0

        if point==1:
            score+=1
            print("Yesss! You won the game!")

        else:
            print("Oops! You lost the game! Correct word was: ", target)

        #asks user to see if game continues
        answer=(input("Do you want to play again? Y/N ")).lower()
        #in either case it cleans the graphic screen
        clear_page()
            
    user_output(score)

main()
