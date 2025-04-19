type Paths<T, key extends keyof T = keyof T> = 
    key extends string // is key string
    ? T[key] extends Record<string, any> | readonly any[] // is t[key] object or array
        ? `${key}` | `${key}.${Paths<T[key], Exclude<keyof T[key], keyof any[]>>}` // recursive call
        : `${key}`
    : never;


    type Obj = {
        user: {
          name: string;
          hobbies: { title: string; }[];
          address?: {
            city: string;
            street: string;
          };
        };
      };

      type objPaths = Paths<Obj>;
      let typesValue:objPaths