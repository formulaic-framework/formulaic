import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";

@Injectable()
export class HashService {

  public async hash(plaintext: string, rounds: number = 12): Promise<string> {
    return hash(plaintext, rounds);
  }

  public async compare(plaintext: string, storedHash: string): Promise<boolean> {
    return compare(plaintext, storedHash);
  }

}
