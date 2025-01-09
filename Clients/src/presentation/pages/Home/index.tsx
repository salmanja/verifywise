import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useCallback,
  useMemo,
  FC
} from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { NoProjectBox, styles } from "./styles";
import emptyState from "../../assets/imgs/empty-state.svg";
import { getAllEntities } from "../../../application/repository/entity.repository";
import { ProjectCardProps } from "../../components/ProjectCard";

// Lazy load components
const ProjectCard = lazy(() => import("../../components/ProjectCard"));
const Popup = lazy(() => import("../../components/Popup"));
const CreateProjectForm = lazy(
  () => import("../../components/CreateProjectForm")
);
const MetricSection = lazy(() => import("../../components/MetricSection"));

// Custom hook for fetching projects
const useProjects = (isNewProject: boolean, resetIsNewProject: () => void) => {
  const [projects, setProjects] = useState<ProjectCardProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getAllEntities({ routeUrl: "/projects" })
      .then(({ data }) => {
        setProjects(data);
        setError(null);
        resetIsNewProject();
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError("Failed to fetch projects: " + err.message);
          setProjects(null);
          resetIsNewProject();
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          resetIsNewProject();
        }
      });
    return () => controller.abort();
  }, [isNewProject]);

  return { projects, error, isLoading };
};

interface HomeProps {
  onProjectUpdate: () => void;
}

const Home: FC<HomeProps> = ({ onProjectUpdate }) => {
  const theme = useTheme();
  const [isNewProject, setIsNewProjectCreate] = useState(false);
  const { projects, error, isLoading } = useProjects(isNewProject, () => setIsNewProjectCreate(false));
  
  const NoProjectsMessage = useMemo(
    () => (
      <NoProjectBox>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={emptyState} alt="Empty project state" />
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            mt: 13.5,
            color: theme.palette.text.tertiary,
          }}
        >
          You have no projects, yet. Click on the "New Project" button to start
          one.
        </Typography>
      </NoProjectBox>
    ),
    [theme]
  );

  const newProjectChecker = (data: boolean | ((prevState: boolean) => boolean)) => {
    setIsNewProjectCreate(data)
    if (onProjectUpdate) {
      onProjectUpdate();
    }
  }

  const PopupRender = useCallback(() => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const handleOpenOrClose = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null : event.currentTarget);
      },
      [anchor]
    );

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Popup
          popupId="create-project-popup"
          popupContent={<CreateProjectForm setIsNewProjectCreate={newProjectChecker} closePopup={() => setAnchor(null)} />}
          openPopupButtonName="New project"
          popupTitle="Create new project"
          popupSubtitle="Create a new project from scratch by filling in the following."
          handleOpenOrClose={handleOpenOrClose}
          anchor={anchor}
        />
      </Suspense>
    );
  }, []);

  return (
    <Box>
      <Box sx={styles.projectBox} data-joyride-id="project-overview">
        <Typography variant="h1" component="div" sx={styles.title}>
          Projects overview
        </Typography>
        <PopupRender />
      </Box>
      {isLoading ? (
        <Typography component="div" sx={{ mb: 12 }}>
          Projects are loading...
        </Typography>
      ) : error ? (
        <Typography component="div" sx={{ mb: 12 }}>
          {error}
        </Typography>
      ) : null}
      {projects && projects.length > 0 ? (
        <>
          <Stack direction="row" justifyContent="space-between" spacing={15}>
            <Suspense fallback={<div>Loading...</div>}>
              {projects.map((item: ProjectCardProps) => (
                <ProjectCard key={item.id} {...item} />
              ))}
            </Suspense>
          </Stack>
          {(["compliance", "risk"] as const).map((metricType) => (
            <Suspense key={metricType} fallback={<div>Loading...</div>}>
              <MetricSection
                title={`All projects ${metricType} status`}
                metricType={metricType}
               />
            </Suspense>
          ))}
        </>
      ) : (
        NoProjectsMessage
      )}
    </Box>
  );
};

export default Home;
