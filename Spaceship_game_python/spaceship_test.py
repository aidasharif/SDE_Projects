


'''
    Aida Sharif Rohani
    HW 5
    
    I  have 2 functions that are not related to drawing nor to user activity

'''


from spaceship import get_max
from spaceship import get_word


def main():

    #checking the get word function to know if it actually picks any words
    #from dictionary
    print('testing get_word()')
    num_passed=0
    num_failed=0

    for i in range(10):
        name_generated=get_word()

        if len(name_generated)!=0:
            num_passed+=1
        else:
            num_failed+=1

    print('Passed', num_passed, 'Failed', num_failed)

    #checking the get max function with known score 
    print('testing get_max()')
    num_passed=0
    num_failed=0

    list_test1=[[['Laleh',4],['Diman',66],['Fun',88],['Shanei',9]],100,100]
    list_test2=[[['naa',65],['Boss',22],['park',309],['aida',21]],45,309]

    print(list_test1[0])
    print(list_test1[0])

    for i in list_test1[0]:
        maxx=get_max(list_test1[0],list_test1[1])

    if maxx==list_test1[2]:
        num_passed+=1
    else:
        num_failed+=1

    for i in list_test2[0]:
        maxx=get_max(list_test2[0], list_test2[1])

    if maxx==list_test2[2]:
        num_passed+=1
    else:
        num_failed+=1


    print('Passed', num_passed, 'Failed', num_failed)



main()
