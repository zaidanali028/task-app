## A SIMPLE TASK API (FULLY BACKEND)

## THIS TUTORIAL WILL WALK YOU THROUGH HOW TO TEST THE API ENDPOINTS

# I HOPE YOU LIKE IT

- API LINK=> https://king-task-api-app.herokuapp.com/
- GITHUB REPO=> https://github.com/zaidanali028/task-app

### SETUP(LOCAL)

```
> Fork and clone this repo if you want to run this API locally
> $run npm i (Run This Command To Install The Packages In The package.json )

```

> Open the .env file in this repo and add these

```
    JWT_SEC=YOUR JWT SECRET SHOULD BE HERE FOR SIGNING USER_TOKENS
    SENDGRID_KEY=YOUR SENDGRID API KEY FOR SENDING EMAILS TO CLIENS
    CLOUD_DB_URI=YOU CAN GENERATE ON ON MLAB OR MONGODB ATLAS
```

## MAKING API CALLS FROM THE PRODUCTION SERVER
# MAKING FIRST "GET REQUEST"

> https://king-task-api-app.herokuapp.com/

```
    If everything went all well  as expected,you should get the object below as a reponse with a 200 status

    {"successGET": "Successfully did your first GET request to king-task-api-app! cheese :)"}

```
# REGISTERING AN ACCOUNT(POST) /user
> Using the same URL from above,you can create a new user by 

> Sending a POST a request to {{url}}/user where {{url}} stands for the URL defined above.You can do so In postman by setting the URL  provided above as a gloal variable so when modifying URLs, you can do so once since its just a variable now.

> Run npm start to to run node app.js. Use Postman in testing 

> Use x-www-form-urlencoded in the body section of postman or json body(thats what I will be using).In the json body,inorder to register a user,the server requires 3(three) properties,and that is ,Username,Email ,Password and Age.Lets go ahead and provide that:
```
    {
    "name":"your name",
    "email":"example@gmail.com",
    "password":"any value greated than six and doesn't contain the word password",
    "age":"yourage"

}
```
> (Plese check your email  after firing this off for an account confirmation message from the server) After you fire this off in postman,you should get this:
```
    {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNiODRmMWNkMThlMzNmZGMzNjFhMmEiLCJpYXQiOjE2MDcxNzMzNjF9.lz93aFQsXMCQNsaf3NlEgcLS6ByBQ357o5IkuRvggC4",
    "newUser": {
        "_id": "5fcb84f1cd18e33fdc361a2a",
        "name": "Ali  i Zaidan",
        "email": "zianai028@gmail.com",
        "age": 20,
        "createdAt": "2020-12-05T13:02:41.150Z",
        "updatedAt": "2020-12-05T13:02:41.150Z",
        "__v": 0
    }
}
```
> That above is a response with a status of 201 telling the client who made the request that his/her account has been successfully created,in the body,the user can find his profile details and a token(Which we will be making use of later).Please make sure you don't re-register with the same e-mail twice as that will trigger a bad response telling you a user with that email is already on the system.

# READING PROFILE (GET) /user/profile
> After registering,a user will be automatically logged in because after registeration,the system generated a unique token for the user to login

> Lets see how we will utilize this token
> At where a user is making this request on postman,I will urge you to setup a new postman  collectioon and do this simple setup
> After creating your collection,hover on your collection name and select a three dotted icon which can be found at te bottom right of your collection's tab,click on it and select edit

>Your will see Authorization just after Description,Move to that place and  under type,select Bearer Token and then under token, provide this variable {{authToken}}
 
>Now click o update to update your collection.Come back to a GET request under your collection and provide the api's url together with /user/profile,Now under authorization,select type as inherit from parent.Don't fire your request yet,go back to the request you used to registrer,that is {{url}}/user (POST) and then you will see something like (tests).

> Tests help us make or create some automated script to provide certain things automatically to postman without doing it manually each time we make a request.Write the aove script under test and save your request
```
    //if user is created,
    if(pm.response.code === 201){
        pm.environment.set('authToken',pm.response.json().token)
}
```

> What you are seeing is simple,we are telling postman that,if the repponse coming is having the status code of 201,that is ,if an account was created,postman should look in its environment variables and set the authToken value to the token that is coming from the response.As seen above ,when you registered you got a token right?we are making use of that token now.


>The nex step is to run  your get request to {{url}}/user/profile,and a success 200 status response will be something like this
```
    {
    "_id": "5fcb84f1cd18e33fdc361a2a",
    "name": "Ali  i Zaidan",
    "email": "zianai028@gmail.com",
    "age": 20,
    "createdAt": "2020-12-05T13:02:41.150Z",
    "updatedAt": "2020-12-05T13:02:41.285Z",
    "__v": 1
}
```

# LOGGING INTO YOUR ACCOUNT  (POST) /user/login

> Make sure to inherit authorization from parent here too like we did before

> Create a new request under the collection you created and make a POST request to {{url}}/user/login

> Under this request,go to Tests and hard code this,as we did before but there will be a slight change

```
    if(pm.response.code === 200){
    pm.environment.set('authToken',pm.response.json().token)
}
```
> This too helps us in getting the value for the authToken variable each time we invoke a request to that url.What the code above does is telling postman that,if you provided the required credentials and loged in successfully with your token,you should get a 200 status meaning everything went on well,and if that happens,postman should set the authToken variable's value to the token property's value gotten from the response that is coming.The only difference from the previous script and this one is,the first one which is the registeration URL  will be expecting a 201(created) sttus code and the login URL will be expecting 200(Ok)

> Now,navigate to the body of this request in postman,use the raw,and change Text to json.Input this to login

```
    {
    "email":"youremail@mail.com",
    "password":"yourpassword"
}
```
    
>Send your post request now ,and if all went well.Your response should be like this with a 200 status(OK):
```
    {
    "user": {
        "_id": "5fcb84f1cd18e33fdc361a2a",
        "name": "Ali  i Zaidan",
        "email": "zianai028@gmail.com",
        "age": 20,
        "createdAt": "2020-12-05T13:02:41.150Z",
        "updatedAt": "2020-12-05T13:02:41.285Z",
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNiODRmMWNkMThlMzNmZGMzNjFhMmEiLCJpYXQiOjE2MDcxODA0NTF9.ht95LhEgCE66Si2AuVUqP-joEyU1TeleEFmPW0_H9lg"
}
```

>If you input a wrong password,postman will hang,that should tell you there is a problem,you can check your console to verify that your password was wrong if you are running thiis API locally.


# UPDATING USER DETAILS (PATCH) /user/me

> Make sure to inherit authorization from parent here too like we did before


>Under CRUD operations,we have Create,Read,Update and Delete,We have done Create,some aspects of Read,Now lets explore UPDATE

>GO to  {{url}}/user/me,now under authorization,as usual,select inherit from parent where we have our authToken variable storing our token when we logged in or registered.Now,just like how we tested the previous request,do same here,just that for now,these are what the system currently can allow you  a client to update (["name", "email", "age"]),any value apart from these will be rejected by the system.Lets try and change our name and age.Do this(in json body):

```
    {
    "name":"githubLover",
    "age":102
}
```
>Now,fire-off this request and if all went well,you should have a response of your profile details but this time,these two fields will hange with the updated one

```
    {
    "_id": "5fcb84f1cd18e33fdc361a2a",
    "name": "githubLover",
    "email": "zianai028@gmail.com",
    "age": 102,
    "createdAt": "2020-12-05T13:02:41.150Z",
    "updatedAt": "2020-12-05T15:17:04.257Z",
    "__v": 2
}
```
# UPDATING USER PASSWORD (PATCH) /user/update/mypassword

> Make sure to inherit authorization from parent here too like we did before

> Create a new request in your collection and send a request to this URL, {{url}}/user/update/mypassword.Make sure to define this in the json body before firing-off the request to prevent server errors.This is an example to guide you:
```
{
    "current":"40404040",
    "password":"newpwd£$2"
}
```
> The current property,expects your current password whiles the password property expects your new password as its value.If all goes well as expected,you should get this as a response:
{
    ``` 
    {
    "_id": "5fcba9855183df2b44083186",
    "name": "Ali  i Zaidan",
    "email": "zianai028@gmail.com",
    "age": 20,
    "createdAt": "2020-12-05T15:38:45.867Z",
    "updatedAt": "2020-12-05T15:40:33.264Z",
    "__v": 2
}
    ```

> You can verify this update by trying to log into your account with your previous password.You will ofcourse not have access to your account unless you try again using the new password you just created


# PROFILE PICTURE UPLOAD FEATURE (POST) /user/me/avatar

> Make sure to inherit authorization from parent here too like we did before


> As an authenticated user,just like other appliations,you sohould be able to upload a profile picture.

> Doing this is very simple and fast to implement,by default,you don't have a profile picture.Lets set one up

>Make a POST request to {{url}}/user/me/avatar.This time in the body field,we will send something different(NOT A JSON)

> Under body,select form-data and under key,write this, avatar .Hover on the avatar key and change its type from text to file.

> Under value,click on Select Files and select a picture you want,there is are limitations here(PLEASE NOTE YOU CANNOT UPLOAD A PICTURE MORE THAN 1MB WORTH OF SIZE,AND ALSO,YOUR PICTURE SHOULD BE IN THESE FORMATS jpg OR jpeg OR png)

> After all the above conditions are met,go ahead and fire off your request and verify your picture is uploaded by getting a 201(CREATED) response.We will see our profile picture in the next API endpoint.

# RENDER PROFILE PICTURE  FEATURE (GET) /:id/avatar

> Open any browser on your system
> Go to https://king-task-api-app.herokuapp.com/youruserid/avatar
> An example https://king-task-api-app.herokuapp.com/5fcba9855183df2b44083186/avatar  

> When you make a get request to The above url using your userid,you should see the picture you uploaded in a 250 by 250 width and height.

> I did so for uniformity since we do not want different picture sizes as our application's picture :)

# DELETING USER PROFILE PICTURE (DELETE) /user/me/avatar

>We have done alot of CRUD operations so far,but we have not done (DELETE) yet.Lets kick-off our first DELETE request to the system.

> Make sure to inherit authorization from parent here too like we did before

> Go to {{url}}/user/me/avatar,remember is a DELETE request,fire-off your new delete request.

> If all went well,you should see this as a response from the server:

```{
    "success": "User profile successfully deleted"
}
```

# CREATING A TASK(POST) /task

> Make sure to inherit authorization from parent here too like we did before

>Create a new request from your collection to {{url}}/task.Always remember that {{url}} is the API's url setted as a global variable.If you cannot do so,simply send all your requests to https://king-task-api-app.herokuapp.com

>Lets say we are not using {{url}} global variable here then you can simply do this https://king-task-api-app.herokuapp.com/task.

>This request accepts these (["description","completed"]).So the json body.You can be something like this:

```
    {
    "description":"My First Task",
    "completed":true
}
```

> You can also decide to stick to just definig description in the json body since the system automatically presumes any new task is not completed,a task without a completed boolean of true/false value will be false by default.

> If all went well ,your respponse should be like this:
```
    {
    "completed": true,
    "_id": "5fcbb2185183df2b44083189",
    "description": "My First Task",
    "worker": "5fcba9855183df2b44083186",
    "createdAt": "2020-12-05T16:15:20.266Z",
    "updatedAt": "2020-12-05T16:15:20.266Z",
    "__v": 0
}
```


# READING USER TASK(GET) /task
> Make sure to inherit authorization from parent here too like we did before.

> GET all your tasks by firing this off {{url}}/task as a GET request,

> This API endpoint is a bit tricky,I will do my best to explain it to you.This API endpoint accepts these in its URL queries.This is very important if a user wants someting specific,maybe if a user wants only incomplete tasks,a user wants first 10 tasks,or maybe a user wants only the third task he/she created


```
    sortBy=>  This  sorts the user's task either by descending or ascending order.
    completed=> This takes a true or false value
    limit=> The amount of tasks to send
    skip=> The amount of tasks to skip and send the rest as a response

    ========================================TRY THESE OUT============================================
    {{url}}/task?sortBy=createdAt_desc&completed=true&limit=1&skip=0
    {{url}}/task?sortBy=createdAt_desc&completed=false
    {{url}}/task?completed=true
    {{url}}/tasks?limit=3&skip=10
    {{url}}/task?sortBy=createdAt_desc
            ==============SIMPLE PAGINATION FOR 3 TASKS ON EVERY REQUEST ABOVE==================
                    //first page== {{url}}/task?&limit=3&skip=0(skip none,send first 3)
                    //Second page== {{url}}/task?&limit=3&skip=3(skip 3,send second 3)
                    //Third page== {{url}}/task?&limit=3&skip=6(skip 6,next 3)

```

# READING A SPECIFIC USER TASK(GET) /task/:id
> Make sure to inherit authorization from parent here too like we did before.

>After getting all our tasks from the above endpoint,we can go ahead and find just one by any of our task's id

> Make a GET request to {{url}}/task/anyofyourtasksid
>Example                {{url}}/task/5fcbb2185183df2b44083189

> If all went on well ,a user should get something like this as a response:

```
    {
    "completed": true,
    "_id": "5fcbb2185183df2b44083189",
    "description": "My First Task",
    "worker": "5fcba9855183df2b44083186",
    "createdAt": "2020-12-05T16:15:20.266Z",
    "updatedAt": "2020-12-05T16:15:20.266Z",
    "__v": 0
}
```

# UPDATING A  USER TASK(PATCH) /task/:id

> Make sure to inherit authorization from parent here too like what we did before.

> With your task's id ,any of the tasks you created can be updated.Simply provide an id at the /:id place holder in your request and make sure your request is a PATCH request and you will be good to go.Remember you can only update your task's description and completed status,anything apart from this will flag a resource not found error.

>A simple demo to kickstart you. Go to {{url}}/task/anyof_your_task's_id

>In json body ,input this:

```
{
    "completed":false,
    "description":"Testing PATCH route"
}
```

> If all went well,this should be the response you should get:
```
{
    "completed": false,
    "_id": "5fcbb2185183df2b44083189",
    "description": "Testing PATCH route",
    "worker": "5fcba9855183df2b44083186",
    "createdAt": "2020-12-05T16:15:20.266Z",
    "updatedAt": "2020-12-05T16:52:47.214Z",
    "__v": 0
}
```

# DELETING A  USER TASK(DELETE) /task/:id

> Make sure to inherit authorization from parent here too like what we did before.

> With your task's id ,any of the tasks you created can be delted.Simply provide an id at the /:id placeholder in your request and make sure your request is a DELETE request,you will be good to go.Remember you can only DELETE your tasks.

>A simple demo to kickstart you. Go to {{url}}/task/anyof_your_task's_id
>An example {{url}}/task/5fcbb2185183df2b44083189

> If all went well,this should be the response you should get:
```
{
    "success": "Task with id 5fcbb2185183df2b44083189 is succesfully removed"
}
```

# DELETING All  USER TASK(DELETE) /task/alltasks

> Make sure to inherit authorization from parent here too like what we did before.

> With you logged in ,all of the tasks you created can be deleted.Simply fire-off this endpoint and get it done.Remember you can only DELETE your tasks.

>A simple demo to kickstart you. Go to {{url}}/task/anyof_your_task's_id
>An example {{url}}/task/alltasks

> If all went well,this should be the response you should get:
```
{
    "tasks": []
    //All my tasks are deleted and that is why I got an empty array :)
}

```

# LOGGING OUT FROM YOUR ACCOUNT (POST) /user/logout
> Make sure to inherit authorization from parent here too like what we did before.

> Trigger a POST request to  {{url}}/user/logout

> If all went well,this should be the response you should get:

```
{
    "success": "Successfully Killed Session"
}
```


# LOGGING OUT FROM ALL YOUR LOGGED IN DEVICES (POST) /user/logloutall
> Make sure to inherit authorization from parent here too like what we did before.

> Trigger a POST request to  {{url}}/user/logoutall

> If all went well,this should be the response you should get:

```
{
    "success": "Deleted all user tokens"
}
```


# DELETING A  USER (DELETE) /user/me

> Make sure to inherit authorization from parent here too like what we did before.

> Trigger a DELETE request to  {{url}}/user/me

> If all went well,this should be the response you should get(Check your email once again for an account deletion message):

```
{
    "user": {
        "_id": "5fcba9855183df2b44083186",
        "name": "githubLover",
        "email": "zianai028@gmail.com",
        "age": 20,
        "createdAt": "2020-12-05T15:38:45.867Z",
        "updatedAt": "2020-12-05T16:08:08.223Z",
        "__v": 2
    }
}

```

# MY FINAL WORDS;

``` 
    I hope you loved this simple and yet interactive tutorial for the king-task-api,You can email me zaidanali028@gmail.com if you have any suggestions,modifications or enquiries to make.

    You can also check out my other works on this github account,I have a nodemailer api,a passport auth,a cms and a full web app(FRONTEND AND BACKEND) which is a fundraiser app.You can check it out here. https://sftna.herokuapp.com/

    You can email me for admin details to the above application so you can explore its powerful abilities like
    #Accepting pending user requests
    #Sending emails to users
    #Monthly User payments
    #Yearly User payments
    #Removing User/Users
    #Emailing Users
    #Password reset through SMS among others

    Thank you once again for your time :)


```

#### CHEESE! 