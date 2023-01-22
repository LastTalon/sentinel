import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { Environment, setEnvironment } from "shared/idAttribute";
import { getEvent } from "shared/remotes";

getEvent("EcsReplication");
setEnvironment(Environment.Server);
start(Host.Server);
