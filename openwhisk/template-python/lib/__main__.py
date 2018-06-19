# -*- coding: utf-8 -*-

def main(args):
    name = args.get("name", "stranger")
    greeting = "Hello " + name + "!"
    print(greeting)
    args["payload"] = "Hallo Python";
    args["htmlText"] = "Hallo aus Python";
    return args