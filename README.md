# Foundry Scripts

These are the macros my players use in game. Feel free to message me with suggestions for better implementations. 
If you need to contact me, hit me up on Bimberman#3448 or @ me on Foundry Discord.
Special thanks to @Kekilla#7036, @Kandashi (He/Him)#6698, @Crymic#9452, and the entire community for helping me along the way.

## Modules used

I will try to update specific folders with required modules and videos of implementation.

## Live Demo

I will try to update specific folders with videos of usage.

## Macro

Please refer to the <a href="https://foundryvtt.com/article/macros/" target="_blank">foundry docs.</a>

## Preview
![Example Demo](https://raw.githubusercontent.com/bimberman/foundry-scripts/main/Classes/Paladin/lay-on-hands-demo.gif)

## Development

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL 10 or higher

### Getting Started

1. Clone the repository
    ```shell
    git clone https://github.com/bimberman/om.git
    cd om
    ```
2. Make a copy of the .env.example file, name the new file .env, and edit the file
    1. Edit the .env file as appropriate for your setup (for examaple if port 3000 is used by another program, then use a different port) 
    2. Change the user to dev and password to lfz
    ```
    PORT=3001
    DEV_SERVER_PORT=3000
    DATABASE_URL=postgres://user:pass@localhost/om
    SESSION_SECRET=secret
    SESSION_EXPIRY=28800000
    ```
3. Install all of the dependencies via NPM
    ```shell
    npm install
    ```
4. Verify the postgresql service is running
    1. Please note that if the postgresql service is not running, then change **STATUS** with **START** in the following command
    ```shell
    sudo service postgresql status
    ```
5. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.
    ```shell
    npm run dev
    ```
