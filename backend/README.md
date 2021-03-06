# XML to MySQL
A Rust tool to download a XML file from [Datex II](https://datex2.eu/), parse the data and insert it to a MySQL database.

## Notice
This tool was made for my own sake of practice and interest, time is scarce and maybe I will spend some more time polishing this tool but don't expect much.

## Installation

Use [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) to install XML to MySQL.

## Usage

```rust
extern crate ...
```
## Built With
* [Rust](https://www.rust-lang.org/) - The programming language
* [reqwest](https://github.com/seanmonstar/reqwest) - HTTP Client for Rust.
* [quick-xml](https://github.com/tafia/quick-xml) - High performance xml pull reader/writer
* [rust-mysql-simple](https://github.com/blackbeam/rust-mysql-simple) - Mysql client library implemented in rust
* [Bash](https://www.gnu.org/software/bash/manual/bash.html) - Bash
* and more...

## Bash (Unix shell) - Scripts
As of 2021 the solution now uses bash scripts, rustbackground.sh and camera_script.sh.
* rustbackground.sh - Checks if the Rust backend is running on the server. If its not running it will try to start the process and inform a user by email.
* camera_script.sh - Retrives the camera data from a XML file and stores the data in /.../bilder and sends it MySQL.

## Contributing
Pull requests are welcome. You are more than welcome to open an issue to discuss what you would like to change or add/remove.

## License
[MIT](https://choosealicense.com/licenses/mit/)
