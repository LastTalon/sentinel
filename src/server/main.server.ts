import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { setEnvironment } from "shared/idAttribute";
import { getEvent } from "shared/remotes";

const HOST = Host.Server;

// We only do this here at the moment to create a dummy event for replication.
// In the future this will be created by the replication system.
getEvent("EcsReplication");

setEnvironment(HOST);
start(HOST);
