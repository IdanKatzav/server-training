import nconf from "nconf";

export const setConfig = () => {
    nconf.file({file: 'config/ama-romach-config.json'});
}
