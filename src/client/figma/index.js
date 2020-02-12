import axios from 'axios';

class FigmaClient {
  constructor(props) {
    this.token = props.token;
  }

  async listProjectFiles(projectId) {
    try {
      const { data } = await axios({
        url: `https://api.figma.com/v1/projects/${projectId}/files`,
        headers: { 'X-FIGMA-TOKEN': this.token }
      });

      return data;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

  async listComments(fileId) {
    try {
      const { data } = await axios({
        url: `https://api.figma.com/v1/files/${fileId}/comments`,
        headers: { 'X-FIGMA-TOKEN': this.token }
      });

      return data;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

}

export default FigmaClient;
