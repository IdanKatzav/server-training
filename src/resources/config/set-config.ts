import nconf from "nconf";

export const setConfig = () => {
    nconf.file({file: 'src/resources/config/ama-romach-config.json'});
}
