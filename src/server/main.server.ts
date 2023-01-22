import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { Environment, setEnvironment } from "shared/idAttribute";
import { getEvent } from "shared/remotes";

// We only do this here at the moment to create a dummy event for replication.
// In the future this will be created by the replication system.
getEvent("EcsReplication");

setEnvironment(Environment.Server);
start(Host.Server);
