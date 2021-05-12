#include <stdio.h>	
#include <stdlib.h>     
#include <string.h>     
#include <unistd.h>     
#include <sys/wait.h>	
#include <fcntl.h>	
#include<signal.h>
#include <time.h>
#include<ctype.h>


#define COMMANDS1 139	// Number ofcommands executed by exec
#define COMMANDS2 8    // Number of builtin commands

char PWD[1024];	//current working directory
char PATH[1024]; //path for finding commands

//list of all commands I could found from bin, I checked the most popular ones and had limited time to check all 139 ones!!!
char * commands1[] = { "ls", "cat","date","cp", "chown", "rmdir","mv","rm", "mkdir","dd","wc","chgrp","chmod","df","dmesg","false","hostname","kill","ln","login","mknod","more","mount","ps","sed","sh","stty","su","sync","true","unmount","uname","whoami","history", "passwd","less","more","file","tar", "gzip","locate","updatedb", "find","diff", "unmount", "du","free","top","killall","ping","nslookup","telnet","halt","reboot","man","alias","anacron","apropos","apt","apt-get","aptitude","arch","arp","at","atq","atrm","awk", "batch","basename","bc","bg","bzip2","cal","cksum","comm","dir","dmidecode","du","eject","expr","factor","free","groups","gunzip","head","hostnamectl","hwclock","hwinfo","ionice","iostat","ip","iptables","iw","iwlist","kmod","last","locate","lshw","lscpu","lsof","lsusb","md5sum","nano","nc","netstat","nice","nmap","openssl","pidof","ping","pstree","rdiff-backup","scp","shutdown","tar","ssh","stat","sum","tac","tail","talk","time","touch","uniq","uptime","vim","w","wall","watch","wget","which","whatis","whereis","xargs", "yes","youtube-dl","zcmp","zdiff","zz"};

//list of builtin commands
char * commands2[] = {"cd","pwd", "echo","help", "exit","game","clear", "env"};


int help1(char ** args){
        printf("\nBuilt-in commands: ");
        printf("\n\t- help");
        printf("\n\t- exit");
        printf("\n\t- cd dir");
        printf("\n\t- pwd");
        printf("\n\t- echo [string to echo]");
        printf("\n\t- clear");
        printf("\n\t- game");
        
        printf("\n\n");
        printf("Other important bin commands executed by system calls are: ");
	printf("\n\t- ls, cat, date, chown, rmdir, mkdir, wc, chgrp, chmod, hostname, man, and etc...");
        printf("\n\n");
        return 1;
}

//getting environment address for functions like clear.
char *envp[] =
    {
        "TERM=xterm-256color"
    };

//execute1 is responsible to make childs and send a system call to bin commands that ends with NULL pointer
int execute1(char **args){
	if(fork()==0){
		char str[80]="/bin/";
		strcat(str,args[0]);	
                execve(str,args,NULL);
                printf("error\n");
                exit(0);
          }

        return 1;
}

//execute1 is responsible to make childs and send a system call to bin commands that ends with environment
//argument like clear
int execute2(char **args){


        if(fork()==0){
                char str[80]="/bin/";
                strcat(str,args[0]);
                execve(str,args,envp);
                printf("Child: Should never get here\n");
                exit(1);
          }
        return 1;
}


//this builtin function is a guessing game to
//guess numbers from 1 to 10, it does not accept anything but integers
int game1(char **args){

	int random_num = 0;
	int guessed_num = 0;
	int counter = 0; 
	char line[256];
	int isint;

	//generates a random number
	srand(time(NULL));
	//mod to get only from 1 to 10
	random_num = rand() % 10 + 1;

	printf("Guess my number! Between 1 to 10! "); 
		while(1) {
			//reads the line from user
    			fgets(line, sizeof line, stdin);
    			isint = sscanf(line, "%d",&guessed_num);
			//Before entering the game checks if input is an int
    			if (!isint){
				printf("Not an integer, please try again! ");
			}
			//counts number of guesse 
        		counter++;
			
			if (isint){
			//if more than 21 guesses it ends the game
			 if (counter>20){
				printf("You tried  %d times! Aorry try again later! bye\n", counter);
                                return 1;
			}

        		else if (guessed_num == random_num) {
            			printf("You guessed correctly in %d tries! Congratulations!\n", counter);
				return 1;
        		}
			
        		else if (guessed_num < random_num){ 
            			printf("Your guess is too low. Guess again. ");
			}
        		else if (guessed_num > random_num){ 
            			printf("Your guess is too high. Guess again. ");
			}
   		 	} 
		}

	return 1;

}

//change directory built in function
int cd1(char ** args){
	if (args[1] == NULL){
		fprintf(stderr,"mini-shell: one argument required\n");
	}
	else if (chdir(args[1]) < 0){
		perror("mini-shell");
	}
	//updates the address og new directory
	getcwd(PWD, sizeof(PWD));
	return 1;
}

//the only function returning 0 to exit the loop is exit1
int exit1(char ** args){
	return 0;
}

//prints the current PWD
int pwd1(char ** args){
	printf("%s\n", PWD);
	return 1;
}

//prints in terminal the input args
int echo1(char ** args){
	int i = 1;
	while (1){
		if (args[i] == NULL){
			break;
		}
		printf("%s ", args[i]);
		i++;
	}
	printf("\n");
	return 1;
}

//since clear needs to have env as the last argument it's called in execute2 function
int clear1(char ** args){
	execute2(args);
}

//the same as clear1
int env1(char ** args){
        execute2(args);
}

//list of built-in functions, each is associated with Commands2 array
int (* commands2Func[]) (char **) = {
        &cd1,
        &pwd1,
        &echo1,
        &help1,
        &exit1,
	&game1,
	&clear1,
	&env1
};

//in this function args is sent as an argument and 
//by searching arrays commands1 &2 it decides which 
//function to call
int function_call(char ** args){
	int i=0;

	for(i = 0 ; i < COMMANDS1 ; i++){
                if ( strcmp(args[0], commands1[i]) == 0 ){
                        int ret_status = execute1(args);
                        return ret_status;
                }

        }


	for(i = 0 ; i < COMMANDS2; i++){
                if ( strcmp(args[0], commands2[i]) == 0 ){
                        int ret_status = (* commands2Func[i])(args);
                        return ret_status;
                }
        }
	//if not found in either loop then send back a msg
	printf("Command not found please try again!\n");
	return 1;
}

//this function determines if the input contains special characters such as pipe
//if not it calls function_call to execute the corresponding command
int shell_execute(char ** args){

	if (args[0] == NULL){	// Empty command
		return 1;}
	int i = 1;
	int std_in, std_out, std_err;
	std_in=dup(0);
	std_out=dup(1);
	std_err=dup(2);
	//checks argument tokens one by one till it reaches the special pipe character
	while ( args[i] != NULL ){
		if ( strcmp( args[i], "|" ) == 0 ){
			int n = 0;
			char ** p;
			for(p = args; *p != NULL; ++p, ++n) {}
			char ** args1 = (char **) malloc((i+1)*sizeof(char *));
			char ** args2 = (char **) malloc((n-i)*sizeof(char *));	
			int j;
			//makes 2 new arrays for arguments before pipe and arguments after pipe
			//so we can call 2 different function with args1 and args2
			for (j = 0; j < i; j++) {
				args1[j] = args[j];
				printf("args1[%d] is %s\n", j, args1[j]);
			}
			//it's important to make sure last member is NULL
			args1[i] = NULL;
		
			for (j = 0; j < n-i-1; j++) {
				args2[j] = args[i+j+1];
				printf("args2[%d] is %s\n", j, args2[j]);
			}
			args2[n-i-1] = NULL;
			//since output of first argument is the input of the second argument
			//we close normal stdin and stdout variables and we pipe the out
			//result to the second token
			int a[2];
			pipe(a);
			//making a child and executing before pipe
			if (!fork())
			{
				close(1);
				dup(a[1]);
				close(a[0]);
				char str[80]="/bin/";
                		strcat(str,args1[0]);
                		execve(str,args1,NULL);
			}
			//executing after pipe
			else{
				close(0);
				dup(a[0]);
				close(a[1]);
				char str[80]="/bin/";
                		strcat(str,args2[0]);
                		execve(str,args2,NULL);
			}

			return 1;
		}

		
		//countinues checking tokens till the end
		else {i++;}
	}
	//if no pipe or special character is found calls function_call 
	int ret_status=function_call(args);
	//i am trying to take things to before dup 
	dup2(std_in, 0);
	dup2(std_out, 1);
	dup2(std_err, 2);
        return ret_status;
}

//separates characters of command by space and tokens are returned
char ** split_command_line(char * command){
        int position = 0;
        int no_of_tokens = 64;
        char ** tokens = malloc(sizeof(char *) * no_of_tokens);

        char * token = strtok(command, " ");
        while (token != NULL){
		tokens[position] = (char *) malloc(sizeof(char) * strlen(token));
                strcpy(tokens[position], token);
                token = strtok(NULL, " ");
		position++;
        }
        tokens[position] = NULL;
        return tokens;
}

//reads the command line by getline
char * read_command_line(){
        size_t buf_size = 0;
        char * command = NULL;
	size_t cc = getline(&command, &buf_size, stdin);
	command[cc-1] = '\0';
        return command;
}

//signit handler is responsible for ctrl+c signal to exit
void sigint_handler(int signo) {
	write(1,"\nTerminating through signal handler \n",35); 
	exit(0);
}


//the main loop which continues as long as all functions return 1. except for exit which exits
void loop1(){

	int status = help1(NULL);
        char * command_line;
        char ** arguments;
	

	status=1;

        while (status){
                printf("mini-shell> ");
                command_line = read_command_line();
		if ( strcmp(command_line, "") == 0 ){
			free(command_line);
			continue;
		}
                arguments = split_command_line(command_line);
                status = shell_execute(arguments);
		free(command_line);
		char **x = arguments;
        	while (*x != NULL) {
                	free(*x);
                	++x;
        	}
		free(arguments);
        }
}

//main starts by getting the current directory address and calling the main loop
int main(int argc, char ** argv){
	getcwd(PWD,sizeof(PWD));
	printf("%s\n", PWD);
	strcpy(PATH, PWD);
	signal(SIGINT, sigint_handler);
        loop1();

        return 0;
}



