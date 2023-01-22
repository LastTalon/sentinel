import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { Environment, setEnvironment } from "shared/idAttribute";

setEnvironment(Environment.Client);
start(Host.Client);
