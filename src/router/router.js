import { Film, Cinemas, User, Login } from "@/view/main/index";
import Citys from "@/view/Citys/index";
import FilmDetail from "@/view/FilmDetail/index";
import CinemaDetail from "@/view/CinemaDetail/index";
import SelectCinema from "@/view/main/Cinemas/index";
import CinemaSearch from "@/view/CinemaSearch/index";
import SelectSeat from "@/view/SelectSeat/index";
import SetPage from "@/view/set/index";
import BuyTicket from "@/view/BuyTicket/index";

const routers = [
  { path: "/", component: Film, exact: true },
  { path: "/cinemas", component: Cinemas },
  { path: "/user", component: User },
  { path: "/login", component: Login },
  { path: "/citys", component: Citys },
  { path: "/film/detail/:film_id", component: FilmDetail },
  {
    path: "/cinema/detail",
    component: CinemaDetail,
  },
  { path: "/film/cinema/:film_id", component: SelectCinema },
  { path: "/cinema/search", component: CinemaSearch },
  { path: "/select/seat", component: SelectSeat },
  { path: "/set", component: SetPage },
  { path: "/buy/ticket", component: BuyTicket },
];
export default routers;